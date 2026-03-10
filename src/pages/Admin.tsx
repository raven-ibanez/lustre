import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Product, Category, Order, PaymentMethod, HeroSlide } from '@/types';
import { Plus, Edit, Trash2, X, Package, ShoppingCart, BarChart3, TrendingUp, DollarSign, Wallet, Upload, Settings, ListChecks, Calendar, LayoutDashboard, Sparkles, Users, ArrowRight, ArrowLeft, Image } from 'lucide-react';

export function Admin() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [loginError, setLoginError] = useState(false);

    // Tabs State
    const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'categories' | 'orders' | 'analytics' | 'payments' | 'quotation_settings' | 'quotation_records' | 'hero_slides'>('overview');

    // Quotation State
    const [quotationSettings, setQuotationSettings] = useState<any[]>([]);
    const [quotationRecords, setQuotationRecords] = useState<any[]>([]);
    const [isEditingQuotationSetting, setIsEditingQuotationSetting] = useState(false);
    const [currentQuotationSetting, setCurrentQuotationSetting] = useState<any>(null);
    const [viewingQuotation, setViewingQuotation] = useState<any>(null);

    // Hero State
    const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
    const [isEditingHero, setIsEditingHero] = useState(false);
    const [currentHeroSlide, setCurrentHeroSlide] = useState<Partial<HeroSlide> | null>(null);
    const [heroImageFile, setHeroImageFile] = useState<File | null>(null);

    // Form State
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingCategory, setIsEditingCategory] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null);
    const [currentCategory, setCurrentCategory] = useState<Partial<Category> | null>(null);
    const [currentPaymentMethod, setCurrentPaymentMethod] = useState<Partial<PaymentMethod> | null>(null);
    const [isEditingPayment, setIsEditingPayment] = useState(false);
    const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
    const [categoryImageFile, setCategoryImageFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Analytics Filters
    const [dateFilter, setDateFilter] = useState('');
    const [monthFilter, setMonthFilter] = useState('');

    const filteredOrders = products.length > 0 ? orders.filter(order => {
        const orderDate = new Date(order.created_at!);
        const matchDate = !dateFilter || orderDate.toISOString().split('T')[0] === dateFilter;
        const matchMonth = !monthFilter || (orderDate.getMonth() + 1).toString().padStart(2, '0') === monthFilter;
        return matchDate && matchMonth;
    }) : [];

    const resetFilters = () => {
        setDateFilter('');
        setMonthFilter('');
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
        if (passwordInput === adminPassword) {
            setIsAuthenticated(true);
            setLoginError(false);
        } else {
            setLoginError(true);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchData();
        }
    }, [isAuthenticated]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data: productsData, error: productsError } = await supabase
                .from('menu_items')
                .select('*')
                .order('created_at', { ascending: false });

            const { data: categoriesData, error: categoriesError } = await supabase
                .from('categories')
                .select('*')
                .order('sort_order', { ascending: true });

            const { data: ordersData, error: ordersError } = await supabase
                .from('orders')
                .select('*, order_items(*)')
                .order('created_at', { ascending: false });

            const { data: paymentsData, error: paymentsError } = await supabase
                .from('payment_methods')
                .select('*')
                .order('sort_order', { ascending: true });

            const { data: quoteSettingsData, error: quoteSettingsErr } = await supabase
                .from('quotation_settings')
                .select('*')
                .order('category', { ascending: true });

            const { data: quoteRecordsData, error: quoteRecordsErr } = await supabase
                .from('quotation_results')
                .select('*')
                .order('created_at', { ascending: false });

            const { data: heroSlidesData, error: heroSlidesErr } = await supabase
                .from('hero_slides')
                .select('*')
                .order('sort_order', { ascending: true });

            if (productsError) throw productsError;
            if (categoriesError) throw categoriesError;
            if (ordersError) throw ordersError;
            if (paymentsError) throw paymentsError;
            if (quoteSettingsErr) throw quoteSettingsErr;
            if (quoteRecordsErr) throw quoteRecordsErr;
            if (heroSlidesErr) throw heroSlidesErr;

            setProducts(productsData || []);
            setCategories(categoriesData || []);
            setOrders(ordersData || []);
            setPaymentMethods(paymentsData || []);
            setQuotationSettings(quoteSettingsData || []);
            setQuotationRecords(quoteRecordsData || []);
            setHeroSlides(heroSlidesData || []);

            // If quotation settings are empty, initialize them
            if (!quoteSettingsData || quoteSettingsData.length === 0) {
                await initializeQuotationSettings();
            }

            // If hero slides are empty, initialize them
            if (!heroSlidesData || heroSlidesData.length === 0) {
                await initializeHeroSlides();
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const initializeQuotationSettings = async () => {
        const initialSettings = [
            { key: 'gold_price_10k', value: 5000, label: '10k Gold Price per Gram', category: 'Metal' },
            { key: 'gold_price_14k', value: 6500, label: '14k Gold Price per Gram', category: 'Metal' },
            { key: 'gold_price_18k', value: 8500, label: '18k Gold Price per Gram', category: 'Metal' },
            { key: 'silver_price', value: 280, label: 'Silver Price per Gram', category: 'Metal' },
            { key: 'base_craftsmanship', value: 2500, label: 'Base Craftsmanship Fee', category: 'Labor' },
            { key: 'margin', value: 165, label: 'Margin Percentage (e.g. 165 for 1.65)', category: 'Business' },
            { key: 'stone_lab_diamond', value: 9000, label: 'Lab Diamond Base (per ct)', category: 'Stone' },
            { key: 'stone_moissanite', value: 1000, label: 'Moissanite Base (per ct)', category: 'Stone' },
            { key: 'stone_sapphire', value: 1500, label: 'Lab Sapphire Base (per ct)', category: 'Stone' },
            { key: 'stone_emerald', value: 1800, label: 'Lab Emerald Base (per ct)', category: 'Stone' },
        ];

        try {
            const { error } = await supabase
                .from('quotation_settings')
                .upsert(initialSettings);

            if (!error) {
                const { data } = await supabase.from('quotation_settings').select('*');
                setQuotationSettings(data || []);
            }
        } catch (err) {
            console.error('Initialization error:', err);
        }
    };

    const handleSaveQuotationSetting = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentQuotationSetting) return;

        try {
            const { error } = await supabase
                .from('quotation_settings')
                .update({ value: currentQuotationSetting.value })
                .eq('id', currentQuotationSetting.id);

            if (error) throw error;

            setIsEditingQuotationSetting(false);
            setCurrentQuotationSetting(null);
            fetchData();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentProduct) return;

        try {
            const { error } = currentProduct.id
                ? await supabase
                    .from('menu_items')
                    .update(currentProduct)
                    .eq('id', currentProduct.id)
                : await supabase
                    .from('menu_items')
                    .insert([currentProduct]);

            if (error) throw error;

            setIsEditing(false);
            setCurrentProduct(null);
            fetchData();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const { error } = await supabase
                .from('menu_items')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchData();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleSaveCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentCategory) return;

        setIsUploading(true);
        try {
            let image_url = currentCategory.image_url;

            if (categoryImageFile) {
                const fileExt = categoryImageFile.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
                const filePath = `categories/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('categories')
                    .upload(filePath, categoryImageFile);

                if (uploadError) {
                    console.error('Category upload error:', uploadError);
                    if (uploadError.message.includes('bucket not found')) {
                        throw new Error("Storage bucket 'categories' not found. Please create it in your Supabase dashboard.");
                    }
                    throw uploadError;
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('categories')
                    .getPublicUrl(filePath);

                image_url = publicUrl;
            }

            const categoryData = { ...currentCategory, image_url };

            const { error } = currentCategory.id
                ? await supabase
                    .from('categories')
                    .update(categoryData)
                    .eq('id', currentCategory.id)
                : await supabase
                    .from('categories')
                    .insert([categoryData]);

            if (error) throw error;

            setIsEditingCategory(false);
            setCurrentCategory(null);
            setCategoryImageFile(null);
            fetchData();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        // Check if products exist in this category
        const productsInCat = products.filter(p => p.category === id);
        if (productsInCat.length > 0) {
            alert(`Cannot delete category. There are ${productsInCat.length} products assigned to it. Move them to another category first.`);
            return;
        }

        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            const { error } = await supabase
                .from('categories')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchData();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleUpdateOrderStatus = async (id: string, status: Order['status']) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status })
                .eq('id', id);

            if (error) throw error;
            fetchData();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleDeleteOrder = async (id: string) => {
        if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) return;

        try {
            const { error } = await supabase
                .from('orders')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchData();
            if (viewingOrder?.id === id) setViewingOrder(null);
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleSavePaymentMethod = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentPaymentMethod) return;

        try {
            const { error } = currentPaymentMethod.id
                ? await supabase
                    .from('payment_methods')
                    .update(currentPaymentMethod)
                    .eq('id', currentPaymentMethod.id)
                : await supabase
                    .from('payment_methods')
                    .insert([currentPaymentMethod]);

            if (error) throw error;

            setIsEditingPayment(false);
            setCurrentPaymentMethod(null);
            fetchData();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleDeletePaymentMethod = async (id: string) => {
        if (!confirm('Are you sure you want to delete this payment method?')) return;

        try {
            const { error } = await supabase
                .from('payment_methods')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchData();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const initializeHeroSlides = async () => {
        const initialSlides = [
            {
                image_url: '/images/hero-ring.jpg',
                title: 'custom creations',
                subtitle: 'design your dream jewelry with us',
                cta_text: 'GET YOUR RING QUOTATION NOW',
                cta_link: '#quotation',
                sort_order: 0,
                active: true
            },
            {
                image_url: '/images/hero-ring.jpg',
                title: 'discover timeless elegance',
                subtitle: 'fine jewelry crafted with passion',
                cta_text: 'SHOP COLLECTION',
                cta_link: '#shop',
                sort_order: 1,
                active: true
            },
            {
                image_url: '/images/hero-necklace.jpg',
                title: 'new arrivals',
                subtitle: 'exquisite pieces for every moment',
                cta_text: 'Explore Now',
                cta_link: '#shop',
                sort_order: 2,
                active: true
            }
        ];

        try {
            const { error } = await supabase
                .from('hero_slides')
                .insert(initialSlides);

            if (!error) {
                const { data } = await supabase.from('hero_slides').select('*').order('sort_order', { ascending: true });
                setHeroSlides(data || []);
            }
        } catch (err) {
            console.error('Hero initialization error:', err);
        }
    };

    const handleSaveHeroSlide = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentHeroSlide) return;

        setIsUploading(true);
        try {
            let image_url = currentHeroSlide.image_url;

            if (heroImageFile) {
                const fileExt = heroImageFile.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
                const filePath = `hero-banners/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('categories') // Reusing the same bucket for now, or you can create a 'banners' bucket
                    .upload(filePath, heroImageFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('categories')
                    .getPublicUrl(filePath);

                image_url = publicUrl;
            }

            const slideData = { ...currentHeroSlide, image_url };

            const { error } = currentHeroSlide.id
                ? await supabase
                    .from('hero_slides')
                    .update(slideData)
                    .eq('id', currentHeroSlide.id)
                : await supabase
                    .from('hero_slides')
                    .insert([slideData]);

            if (error) throw error;

            setIsEditingHero(false);
            setCurrentHeroSlide(null);
            setHeroImageFile(null);
            fetchData();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteHeroSlide = async (id: string) => {
        if (!confirm('Are you sure you want to delete this hero slide?')) return;

        try {
            const { error } = await supabase
                .from('hero_slides')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchData();
        } catch (err: any) {
            alert(err.message);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="admin-dark min-h-screen flex items-center justify-center px-4">
                <div className="max-w-md w-full p-8 shadow-sm border border-white/10" style={{ backgroundColor: '#1C2F6E' }}>
                    <div className="text-center mb-8">
                        <h2 className="font-serif text-3xl mb-2 text-white">Admin Login</h2>
                        <p className="text-white/60">Enter your password to continue</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <input
                                type="password"
                                placeholder="Admin Password"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                className={`w-full px-4 py-3 border ${loginError ? 'border-red-500' : 'border-white/20'} bg-white/10 text-white placeholder-white/40 focus:border-gold outline-none transition-colors`}
                                required
                            />
                            {loginError && <p className="text-red-400 text-xs mt-1">Incorrect password</p>}
                        </div>
                        <button type="submit" className="w-full btn-primary py-3">
                            Login to Dashboard
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#f8fafc] min-h-screen text-slate-900 font-sans">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                    <div>
                        <h1 className="font-serif text-3xl text-slate-900">Admin Dashboard</h1>
                        <p className="text-slate-500 text-sm">Manage your shop content and logic</p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {activeTab === 'products' ? (
                            <button
                                onClick={() => {
                                    setCurrentProduct({
                                        name: '',
                                        description: '',
                                        base_price: 0,
                                        category: categories[0]?.id || '',
                                        popular: false,
                                        is_new_arrival: false,
                                        available: true,
                                        discount_active: false,
                                        raw_price: 0,
                                        markup_type: 'jewelry'
                                    });
                                    setIsEditing(true);
                                }}
                                className="btn-primary flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add Product
                            </button>
                        ) : activeTab === 'categories' ? (
                            <button
                                onClick={() => {
                                    setCurrentCategory({
                                        name: '',
                                        slug: '',
                                        sort_order: categories.length,
                                        active: true
                                    });
                                    setIsEditingCategory(true);
                                }}
                                className="btn-primary flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add Category
                            </button>
                        ) : activeTab === 'payments' ? (
                            <button
                                onClick={() => {
                                    setCurrentPaymentMethod({
                                        name: '',
                                        account_number: '',
                                        account_name: '',
                                        active: true,
                                        sort_order: paymentMethods.length
                                    });
                                    setIsEditingPayment(true);
                                }}
                                className="btn-primary flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add Payment Method
                            </button>
                        ) : activeTab === 'hero_slides' ? (
                            <button
                                onClick={() => {
                                    setCurrentHeroSlide({
                                        title: '',
                                        subtitle: '',
                                        cta_text: '',
                                        cta_link: '',
                                        sort_order: heroSlides.length,
                                        active: true
                                    });
                                    setIsEditingHero(true);
                                }}
                                className="btn-primary flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add Hero Slide
                            </button>
                        ) : null}
                    </div>
                </div>


                {loading ? (
                    <div className="text-center py-20 italic">Loading dashboard...</div>
                ) : error ? (
                    <div className="bg-red-50 text-red-600 p-4 rounded-md mb-8 text-sm">Error: {error}</div>
                ) : activeTab === 'overview' ? (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Calendar className="w-6 h-6 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">Inventory Overview</h2>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-2">
                                <div className="p-2 bg-slate-50 w-fit rounded-lg">
                                    <Package className="w-5 h-5 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Products</p>
                                    <p className="text-3xl font-bold text-slate-900">{products.length}</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-2">
                                <div className="p-2 bg-emerald-50 w-fit rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Available</p>
                                    <p className="text-3xl font-bold text-emerald-600">{products.filter(p => p.available).length}</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-2">
                                <div className="p-2 bg-amber-50 w-fit rounded-lg">
                                    <Sparkles className="w-5 h-5 text-amber-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Featured</p>
                                    <p className="text-3xl font-bold text-amber-600">{products.filter(p => p.popular).length}</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-2">
                                <div className="p-2 bg-blue-50 w-fit rounded-lg">
                                    <Users className="w-5 h-5 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Categories</p>
                                    <p className="text-3xl font-bold text-blue-600">{categories.length}</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-6 border-b border-slate-50">
                                <h3 className="font-bold text-lg text-slate-900">Quick Actions</h3>
                            </div>
                            <div className="divide-y divide-slate-50">
                                <button
                                    onClick={() => {
                                        setCurrentProduct({
                                            name: '',
                                            description: '',
                                            base_price: 0,
                                            category: categories[0]?.id || '',
                                            popular: false,
                                            is_new_arrival: false,
                                            available: true,
                                            discount_active: false,
                                            raw_price: 0,
                                            markup_type: 'jewelry'
                                        });
                                        setIsEditing(true);
                                    }}
                                    className="w-full flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors text-left group"
                                >
                                    <div className="p-2 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors">
                                        <Plus className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <span className="font-semibold text-slate-700 flex-1">Add New Product</span>
                                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                                </button>
                                <button
                                    onClick={() => setActiveTab('products')}
                                    className="w-full flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors text-left group"
                                >
                                    <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-slate-100 transition-colors">
                                        <Package className="w-5 h-5 text-slate-600" />
                                    </div>
                                    <span className="font-semibold text-slate-700 flex-1">Manage Products</span>
                                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                                </button>
                                <button
                                    onClick={() => setActiveTab('categories')}
                                    className="w-full flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors text-left group"
                                >
                                    <div className="p-2 bg-sky-50 rounded-xl group-hover:bg-sky-100 transition-colors">
                                        <LayoutDashboard className="w-5 h-5 text-sky-600" />
                                    </div>
                                    <span className="font-semibold text-slate-700 flex-1">Manage Categories</span>
                                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                                </button>
                                <button
                                    onClick={() => setActiveTab('payments')}
                                    className="w-full flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors text-left group"
                                >
                                    <div className="p-2 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors">
                                        <Wallet className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <span className="font-semibold text-slate-700 flex-1">Payment Methods</span>
                                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                                </button>
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className="w-full flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors text-left group"
                                >
                                    <div className="p-2 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                                        <ShoppingCart className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <span className="font-semibold text-slate-700 flex-1">Orders Management</span>
                                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                                </button>
                                <button
                                    onClick={() => setActiveTab('quotation_settings')}
                                    className="w-full flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors text-left group"
                                >
                                    <div className="p-2 bg-amber-50 rounded-xl group-hover:bg-amber-100 transition-colors">
                                        <Settings className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <span className="font-semibold text-slate-700 flex-1">Quotation Settings</span>
                                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                                </button>
                                <button
                                    onClick={() => setActiveTab('quotation_records')}
                                    className="w-full flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors text-left group"
                                >
                                    <div className="p-2 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors">
                                        <ListChecks className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <span className="font-semibold text-slate-700 flex-1">Quotation Inquiries</span>
                                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                                </button>
                                <button
                                    onClick={() => setActiveTab('analytics')}
                                    className="w-full flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors text-left group"
                                >
                                    <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-slate-100 transition-colors">
                                        <BarChart3 className="w-5 h-5 text-slate-600" />
                                    </div>
                                    <span className="font-semibold text-slate-700 flex-1">Sales Analytics</span>
                                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                                </button>
                                <button
                                    onClick={() => setActiveTab('hero_slides')}
                                    className="w-full flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors text-left group"
                                >
                                    <div className="p-2 bg-pink-50 rounded-xl group-hover:bg-pink-100 transition-colors">
                                        <Image className="w-5 h-5 text-pink-600" />
                                    </div>
                                    <span className="font-semibold text-slate-700 flex-1">Hero Banner Manager</span>
                                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                                </button>
                            </div>
                        </div>
                    </div>
                ) : activeTab === 'products' ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setActiveTab('overview')}
                                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                                    title="Back to Overview"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 font-serif">Manage Products</h2>
                                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mt-1">Inventory Management</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setCurrentProduct({
                                        name: '',
                                        description: '',
                                        base_price: 0,
                                        category: categories[0]?.id || '',
                                        popular: false,
                                        is_new_arrival: false,
                                        available: true,
                                        discount_active: false,
                                        raw_price: 0,
                                        markup_type: 'jewelry'
                                    });
                                    setIsEditing(true);
                                }}
                                className="bg-primary text-white p-2.5 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Mobile Card Layout */}
                        <div className="grid grid-cols-1 gap-4 md:hidden">
                            {products.map((product) => (
                                <div key={product.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm active:scale-[0.98] transition-all">
                                    <div className="flex gap-4">
                                        {product.image_url ? (
                                            <img className="h-20 w-20 rounded-xl object-cover border border-slate-50" src={product.image_url} alt="" />
                                        ) : (
                                            <div className="h-20 w-20 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-50">
                                                <Package className="w-8 h-8 text-slate-200" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <div className="font-bold text-slate-900 truncate pr-2">{product.name}</div>
                                                <div className="font-bold text-primary">₱{product.base_price.toLocaleString()}</div>
                                            </div>
                                            <div className="text-xs text-slate-400 mb-3">{categories.find(c => c.id === product.category)?.name || product.category}</div>
                                            <div className="flex flex-wrap gap-1.5 mb-4">
                                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-tighter ${product.available ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                                    {product.available ? 'In Stock' : 'Out of Stock'}
                                                </span>
                                                {product.popular && <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">Favorite</span>}
                                                {product.is_new_arrival && <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">New</span>}
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setCurrentProduct(product);
                                                        setIsEditing(true);
                                                    }}
                                                    className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <Edit className="w-3 h-3" /> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                    className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Table View */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hidden md:block">
                            <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Product</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Category</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Price</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100 text-sm">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {product.image_url ? (
                                                    <img className="h-10 w-10 rounded-lg object-cover mr-3 border border-slate-100" src={product.image_url} alt="" />
                                                ) : (
                                                    <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center mr-3">
                                                        <Package className="w-5 h-5 text-slate-400" />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-semibold text-slate-900">{product.name}</div>
                                                    <div className="flex gap-1">
                                                        {product.popular && <span className="text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded font-bold uppercase">Favorite</span>}
                                                        {product.is_new_arrival && <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold uppercase">New</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                                            {categories.find(c => c.id === product.category)?.name || product.category}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-900 font-bold">
                                            ₱{product.base_price.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-bold rounded-full ${product.available ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                                {product.available ? 'Available' : 'Out of Stock'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                                            <button
                                                onClick={() => {
                                                    setCurrentProduct(product);
                                                    setIsEditing(true);
                                                }}
                                                className="text-primary hover:text-primary/80 mr-3 p-2 hover:bg-primary/5 rounded-lg transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                ) : activeTab === 'categories' ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setActiveTab('overview')}
                                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                                    title="Back to Overview"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 font-serif">Manage Categories</h2>
                                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mt-1">Classification Management</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setCurrentCategory({ name: '', slug: '', sort_order: 0, active: true });
                                    setIsEditingCategory(true);
                                }}
                                className="bg-primary text-white p-2.5 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Mobile Card Layout */}
                        <div className="grid grid-cols-1 gap-4 md:hidden">
                            {categories.map((category) => (
                                <div key={category.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="font-bold text-slate-900 text-lg">{category.name}</div>
                                            <div className="text-xs text-slate-400 font-mono mt-0.5">{category.slug}</div>
                                        </div>
                                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-widest ${category.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                            {category.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-2">
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Order: <span className="text-slate-900 ml-1">{category.sort_order}</span></div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setCurrentCategory(category);
                                                    setIsEditingCategory(true);
                                                }}
                                                className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCategory(category.id)}
                                                className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Table View */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hidden md:block">
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Category Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Slug</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Order</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100 text-sm">
                                {categories.map((category) => (
                                    <tr key={category.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-900">
                                            {category.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                                            {category.slug}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-900 font-medium">
                                            {category.sort_order}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-bold rounded-full ${category.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                                {category.active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                                            <button
                                                onClick={() => {
                                                    setCurrentCategory(category);
                                                    setIsEditingCategory(true);
                                                }}
                                                className="text-primary hover:text-primary/80 mr-3 p-2 hover:bg-primary/5 rounded-lg transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCategory(category.id)}
                                                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                ) : activeTab === 'orders' ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setActiveTab('overview')}
                                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                                    title="Back to Overview"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 font-serif">Manage Orders</h2>
                                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mt-1">Sales & Fulfillment</p>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Card Layout */}
                        <div className="grid grid-cols-1 gap-4 md:hidden">
                            {orders.map((order) => (
                                <div key={order.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="text-[10px] font-mono text-slate-400 mb-1">#{order.id.slice(0, 8)}</div>
                                            <div className="font-bold text-slate-900">{order.first_name} {order.last_name}</div>
                                            <div className="text-xs text-slate-400">{order.email}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-primary mb-2">₱{order.total_amount.toLocaleString()}</div>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">{new Date(order.created_at!).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-2">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                                            className={`px-3 py-1.5 text-xs font-bold rounded-lg outline-none transition-all ${order.status === 'completed' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' :
                                                order.status === 'cancelled' ? 'text-red-600 bg-red-50 border-red-100' :
                                                    'text-blue-600 bg-blue-50 border-blue-100'
                                                }`}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setViewingOrder(order)}
                                                className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-primary rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors"
                                            >
                                                View Details
                                            </button>
                                            <button
                                                onClick={() => handleDeleteOrder(order.id)}
                                                className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Table View */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hidden md:block">
                            <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Order ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Customer</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Total</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Date</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100 text-sm">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-400">
                                            #{order.id.slice(0, 8)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-slate-900 font-semibold">{order.first_name} {order.last_name}</div>
                                            <div className="text-slate-400 text-xs">{order.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-900 font-bold">
                                            ₱{order.total_amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                                                className={`px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-50 border border-slate-100 outline-none transition-all ${order.status === 'completed' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' :
                                                    order.status === 'cancelled' ? 'text-red-600 bg-red-50 border-red-100' :
                                                        'text-blue-600 bg-blue-50 border-blue-100'
                                                    }`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                                            {new Date(order.created_at!).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                                            <button
                                                onClick={() => setViewingOrder(order)}
                                                className="text-primary hover:text-primary/80 mr-3 p-2 hover:bg-primary/5 rounded-lg transition-colors font-semibold text-xs"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleDeleteOrder(order.id)}
                                                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                ) : activeTab === 'payments' ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setActiveTab('overview')}
                                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                                    title="Back to Overview"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 font-serif">Payment Methods</h2>
                                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mt-1">Transaction Channels</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setCurrentPaymentMethod({ name: '', account_number: '', account_name: '', active: true });
                                    setIsEditingPayment(true);
                                }}
                                className="bg-primary text-white p-2.5 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Mobile Card Layout */}
                        <div className="grid grid-cols-1 gap-4 md:hidden">
                            {paymentMethods.map((method) => (
                                <div key={method.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm transition-all">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 bg-primary/5 rounded-xl text-primary font-bold">
                                            <Wallet className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <div className="font-bold text-slate-900">{method.name}</div>
                                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-widest ${method.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                                    {method.active ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                            <div className="text-xs font-bold text-slate-900 mt-1">{method.account_name}</div>
                                            <div className="text-[10px] font-mono text-slate-400">{method.account_number}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                                        <div className="h-12 w-12">
                                            {method.qr_code_url ? (
                                                <img src={method.qr_code_url} alt="QR" className="h-full w-full object-contain border border-slate-100 rounded-lg p-1 bg-white" />
                                            ) : (
                                                <div className="w-full h-full bg-slate-50 rounded-lg flex items-center justify-center border border-slate-50 italic text-[8px] text-slate-300">No QR</div>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setCurrentPaymentMethod(method);
                                                    setIsEditingPayment(true);
                                                }}
                                                className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeletePaymentMethod(method.id)}
                                                className="p-2.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Table View */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hidden md:block">
                            <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Method Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Account Info</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">QR Code</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100 text-sm">
                                {paymentMethods.map((method) => (
                                    <tr key={method.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-900">
                                            <div className="flex items-center gap-2">
                                                <Wallet className="w-4 h-4 text-primary" />
                                                {method.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-slate-900 font-semibold text-xs">{method.account_name}</div>
                                            <div className="font-mono text-[10px] text-slate-400">{method.account_number}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {method.qr_code_url ? (
                                                <img src={method.qr_code_url} alt="QR" className="h-10 w-10 object-contain border border-slate-100 rounded-lg bg-white p-1" />
                                            ) : (
                                                <span className="text-[10px] text-slate-400 italic">No QR</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-bold rounded-full ${method.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                                {method.active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                                            <button
                                                onClick={() => {
                                                    setCurrentPaymentMethod(method);
                                                    setIsEditingPayment(true);
                                                }}
                                                className="text-primary hover:text-primary/80 mr-3 p-2 hover:bg-primary/5 rounded-lg transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeletePaymentMethod(method.id)}
                                                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                ) : activeTab === 'quotation_settings' ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setActiveTab('overview')}
                                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                                    title="Back to Overview"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 font-serif">Quotation Settings</h2>
                                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mt-1">Pricing Configuration</p>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Card Layout */}
                        <div className="grid grid-cols-1 gap-4 md:hidden">
                            {quotationSettings.map((setting) => (
                                <div key={setting.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className="px-2 py-0.5 text-[10px] bg-primary/10 text-primary rounded uppercase font-bold tracking-tighter mb-2 block w-fit">
                                                {setting.category}
                                            </span>
                                            <div className="font-bold text-slate-900">{setting.label}</div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setCurrentQuotationSetting(setting);
                                                setIsEditingQuotationSetting(true);
                                            }}
                                            className="p-2 bg-slate-50 hover:bg-slate-100 text-primary rounded-xl transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-50">
                                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Current Value</div>
                                        <div className="text-sm font-bold text-slate-900 font-mono">
                                            {typeof setting.value === 'number' ? `₱${setting.value.toLocaleString()}` : JSON.stringify(setting.value)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Table View */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hidden md:block">
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Category</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Setting Name</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Value</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-100 text-sm">
                                    {quotationSettings.map((setting) => (
                                        <tr key={setting.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-[10px] bg-primary/10 text-primary rounded uppercase font-bold tracking-tighter">
                                                    {setting.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">
                                                {setting.label}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-slate-900 font-mono">
                                                {typeof setting.value === 'number' ? `₱${setting.value.toLocaleString()}` : JSON.stringify(setting.value)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                                                <button
                                                    onClick={() => {
                                                        setCurrentQuotationSetting(setting);
                                                        setIsEditingQuotationSetting(true);
                                                    }}
                                                    className="text-primary hover:text-primary/80 p-2 hover:bg-primary/5 rounded-lg transition-colors"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : activeTab === 'quotation_records' ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setActiveTab('overview')}
                                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                                    title="Back to Overview"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 font-serif">Quotation Inquiries</h2>
                                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mt-1">Lead Management</p>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Card Layout */}
                        <div className="grid grid-cols-1 gap-4 md:hidden">
                            {quotationRecords.map((record) => (
                                <div key={record.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="font-bold text-slate-900 text-lg">{record.customer_name}</div>
                                            <div className="text-xs text-slate-400">{record.customer_email}</div>
                                        </div>
                                        <span className="px-2 py-0.5 text-[10px] bg-slate-100 text-slate-600 rounded uppercase font-bold tracking-tighter">
                                            {record.form_data?.preferredComm || 'Email'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-[10px] text-primary font-bold bg-primary/5 px-2 py-1 rounded uppercase tracking-wider">
                                            {record.path.replace('_', ' ')}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-auto">
                                            {new Date(record.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl space-y-2 mb-4">
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Estimated Budget</span>
                                            <span className="text-xs font-bold text-slate-900">₱{record.final_price_low.toLocaleString()} - ₱{record.final_price_high.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Quality Tier</span>
                                            <span className="text-xs font-bold text-slate-900">{record.tier}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setViewingQuotation(record)}
                                        className="w-full py-3 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/10 hover:bg-primary/90 transition-all"
                                    >
                                        View Details
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Table View */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hidden md:block">
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Customer</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Contact Preference</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Path</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Quote Summary</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">Date</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-100 text-sm">
                                    {quotationRecords.map((record) => (
                                        <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-slate-900 font-bold">{record.customer_name}</div>
                                                <div className="text-slate-400 text-xs">{record.customer_email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-[10px] bg-slate-100 text-slate-600 rounded uppercase font-bold tracking-tighter">
                                                    {record.form_data?.preferredComm || 'Email'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-xs text-primary font-bold bg-primary/5 px-2 py-1 rounded">
                                                    {record.path.replace('_', ' ').toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-slate-900 font-bold">₱{record.final_price_low.toLocaleString()} - ₱{record.final_price_high.toLocaleString()}</div>
                                                <div className="text-[10px] text-slate-400 font-medium">{record.tier}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                                                {new Date(record.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                                                <button
                                                    onClick={() => setViewingQuotation(record)}
                                                    className="text-primary hover:text-primary/80 font-bold text-xs p-2 hover:bg-primary/5 rounded-lg transition-colors"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : activeTab === 'hero_slides' ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setActiveTab('overview')}
                                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                                    title="Back to Overview"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 font-serif">Hero Banner Manager</h2>
                                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mt-1">Homepage Content</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setCurrentHeroSlide({
                                        title: '',
                                        subtitle: '',
                                        cta_text: '',
                                        cta_link: '',
                                        sort_order: heroSlides.length,
                                        active: true
                                    });
                                    setIsEditingHero(true);
                                }}
                                className="bg-primary text-white p-2.5 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Mobile & Desktop List/Grid View */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {heroSlides.map((slide) => (
                                <div key={slide.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all">
                                    <div className="relative h-40 bg-slate-100 overflow-hidden">
                                        {slide.image_url ? (
                                            <img src={slide.image_url} alt={slide.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <Image className="w-10 h-10" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3 flex gap-2">
                                            <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase tracking-widest backdrop-blur-md ${slide.active ? 'bg-emerald-500/90 text-white' : 'bg-slate-900/60 text-white'}`}>
                                                {slide.active ? 'Active' : 'Draft'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="flex-1">
                                            <div className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1 line-clamp-1">{slide.subtitle}</div>
                                            <div className="font-bold text-slate-900 mb-2 line-clamp-1">{slide.title}</div>
                                            <div className="text-xs text-slate-400 font-mono">Order: {slide.sort_order}</div>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-slate-50 mt-4 pt-4">
                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{slide.cta_text || 'No CTA'}</div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setCurrentHeroSlide(slide);
                                                        setIsEditingHero(true);
                                                    }}
                                                    className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteHeroSlide(slide.id!)}
                                                    className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {heroSlides.length === 0 && (
                                <div className="col-span-full py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-3">
                                    <Image className="w-12 h-12 opacity-10" />
                                    <p className="font-medium text-sm">No hero slides found</p>
                                    <button
                                        onClick={() => initializeHeroSlides()}
                                        className="mt-2 text-primary font-bold text-xs uppercase tracking-widest hover:underline"
                                    >
                                        Restore Default Slides
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : activeTab === 'analytics' ? (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="flex items-center gap-4 mb-2">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                                title="Back to Overview"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 font-serif">Sales Analytics</h2>
                                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mt-1">Business Intelligence</p>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                <span className="text-sm font-semibold text-slate-600">Filter by:</span>
                            </div>
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-primary transition-all"
                            />
                            <select
                                value={monthFilter}
                                onChange={(e) => setMonthFilter(e.target.value)}
                                className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-primary transition-all"
                            >
                                <option value="">Select Month</option>
                                <option value="01">January</option>
                                <option value="02">February</option>
                                <option value="03">March</option>
                                <option value="04">April</option>
                                <option value="05">May</option>
                                <option value="06">June</option>
                                <option value="07">July</option>
                                <option value="08">August</option>
                                <option value="09">September</option>
                                <option value="10">October</option>
                                <option value="11">November</option>
                                <option value="12">December</option>
                            </select>
                            <button
                                onClick={resetFilters}
                                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all uppercase tracking-wider"
                            >
                                Reset
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-2">
                                <div className="p-2 bg-emerald-50 w-fit rounded-lg">
                                    <DollarSign className="w-5 h-5 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gross Sales</p>
                                    <p className="text-3xl font-bold text-slate-900">
                                        ₱{filteredOrders
                                            .filter(o => o.status === 'completed')
                                            .reduce((sum, o) => sum + (o.order_items?.reduce((s, i) => s + (i.price * i.quantity), 0) || 0), 0)
                                            .toLocaleString()}
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-1 italic">Total Selling Price (Completed)</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-2">
                                <div className="p-2 bg-primary/10 w-fit rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Net Profit</p>
                                    <p className="text-3xl font-bold text-slate-900">
                                        ₱{filteredOrders
                                            .filter(o => o.status === 'completed')
                                            .reduce((sum, o) => {
                                                const gross = o.order_items?.reduce((s, i) => s + (i.price * i.quantity), 0) || 0;
                                                const raw = o.order_items?.reduce((s, i) => s + ((i.raw_price || 0) * i.quantity), 0) || 0;
                                                return sum + (gross - raw);
                                            }, 0)
                                            .toLocaleString()}
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-1 italic">Gross Sales - Total Cost</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-2">
                                <div className="p-2 bg-blue-50 w-fit rounded-lg">
                                    <ShoppingCart className="w-5 h-5 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Filtered Orders</p>
                                    <p className="text-3xl font-bold text-slate-900">{filteredOrders.length}</p>
                                    <p className="text-[10px] text-slate-400 mt-1 italic">Based on current filters</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-2">
                                <div className="p-2 bg-amber-50 w-fit rounded-lg">
                                    <Package className="w-5 h-5 text-amber-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Items Sold</p>
                                    <p className="text-3xl font-bold text-slate-900">
                                        {filteredOrders.reduce((sum, o) => sum + (o.order_items?.reduce((s, i) => s + i.quantity, 0) || 0), 0)}
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-1 italic">In filtered period</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                                <h3 className="font-bold text-xl mb-6 text-slate-900">Filtered Order Activity</h3>
                                <div className="space-y-4">
                                    {filteredOrders.slice(0, 5).map(order => (
                                        <div key={order.id} className="flex items-center justify-between py-4 px-4 hover:bg-slate-50 transition-all rounded-2xl group border border-transparent hover:border-slate-100">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center text-primary font-bold text-sm group-hover:bg-primary/10 transition-colors">
                                                    {order.first_name[0]}{order.last_name[0]}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-900">{order.first_name} {order.last_name}</div>
                                                    <div className="text-xs text-slate-400">{new Date(order.created_at!).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-bold text-slate-900">₱{order.total_amount.toLocaleString()}</div>
                                                <div className={`text-[10px] font-bold uppercase tracking-widest ${order.status === 'completed' ? 'text-emerald-500' :
                                                    order.status === 'cancelled' ? 'text-red-500' :
                                                        'text-primary'
                                                    }`}>{order.status}</div>
                                            </div>
                                        </div>
                                    ))}
                                    {filteredOrders.length === 0 && (
                                        <p className="text-center py-10 text-slate-400 italic">No orders found for this selection.</p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                                <h3 className="font-bold text-xl mb-6 flex items-center gap-2 text-slate-900">
                                    <BarChart3 className="w-5 h-5 text-primary" /> Sales Performance
                                </h3>
                                <div className="h-64 flex items-end gap-3 px-6 pb-6 bg-slate-50/50 rounded-3xl">
                                    {(filteredOrders.length > 0 ? filteredOrders : []).slice(0, 7).reverse().map((order, i) => {
                                        const maxAmount = Math.max(...filteredOrders.map(o => o.total_amount)) || 1;
                                        const height = (order.total_amount / maxAmount) * 100;
                                        return (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-3 group relative h-full justify-end">
                                                <div className="absolute -top-4 bg-slate-900 text-white text-[10px] px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-xl font-bold -translate-y-2 group-hover:translate-y-0 z-20">
                                                    ₱{order.total_amount.toLocaleString()}
                                                </div>
                                                <div
                                                    className="w-full bg-primary/15 group-hover:bg-primary transition-all rounded-t-xl"
                                                    style={{ height: `${Math.max(height, 8)}%` }}
                                                />
                                                <span className="text-[10px] text-slate-400 font-bold rotate-0 whitespace-nowrap">
                                                    {new Date(order.created_at!).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                        );
                                    })}
                                     {filteredOrders.length === 0 && (
                                         <div className="w-full h-full flex items-center justify-center text-slate-400 italic">No data</div>
                                     )}
                                 </div>
                             </div>
                         </div>
                     </div>
                 ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-4">
                        <LayoutDashboard className="w-12 h-12 opacity-20" />
                        <p className="italic font-medium text-sm uppercase tracking-widest">Select a management tab to begin</p>
                    </div>
                )}

                {/* Product Edit Modal */}
                {
                    isEditing && (
                        <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                            <div className="bg-white w-full max-w-2xl max-h-[95vh] overflow-y-auto rounded-3xl shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-300">
                                <div className="p-6 sm:p-10">
                                    <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-6">
                                        <div>
                                            <h3 className="font-bold text-2xl text-slate-900">{currentProduct?.id ? 'Edit Product' : 'Add New Product'}</h3>
                                            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Product Information</p>
                                        </div>
                                        <button onClick={() => setIsEditing(false)} className="bg-slate-50 hover:bg-slate-100 text-slate-400 p-2.5 rounded-full transition-all">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSaveProduct} className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Product Name</label>
                                                <input
                                                    type="text"
                                                    value={currentProduct?.name || ''}
                                                    onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all placeholder:text-slate-300"
                                                    placeholder="Enter product title"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Category</label>
                                                <select
                                                    value={currentProduct?.category || ''}
                                                    onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all"
                                                    required
                                                >
                                                    <option value="">Select Category</option>
                                                    {categories.map((cat) => (
                                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Description</label>
                                            <textarea
                                                value={currentProduct?.description || ''}
                                                onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                                                className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all resize-none min-h-[120px] placeholder:text-slate-300"
                                                placeholder="Describe your product..."
                                                required
                                            />
                                        </div>

                                        <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 space-y-6">
                                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                                <Sparkles className="w-3.5 h-3.5" /> Pricing Configuration
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Pricing Group</label>
                                                    <select
                                                        value={currentProduct?.markup_type || 'jewelry'}
                                                        onChange={(e) => {
                                                            const type = e.target.value as 'jewelry' | 'loose_stone';
                                                            const rawPrice = currentProduct?.raw_price || 0;
                                                            const markup = type === 'jewelry' ? 2.65 : 2.30;
                                                            setCurrentProduct({
                                                                ...currentProduct,
                                                                markup_type: type,
                                                                base_price: Math.round(rawPrice * markup)
                                                            });
                                                        }}
                                                        className="w-full px-5 py-3 bg-white border border-slate-100 rounded-xl text-slate-900 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                                                        required
                                                    >
                                                        <option value="jewelry">Jewelry (+165%)</option>
                                                        <option value="loose_stone">Loose Stones (+130%)</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Raw Cost (₱)</label>
                                                    <input
                                                        type="number"
                                                        value={currentProduct?.raw_price || 0}
                                                        onChange={(e) => {
                                                            const rawPrice = parseFloat(e.target.value) || 0;
                                                            const type = currentProduct?.markup_type || 'jewelry';
                                                            const markup = type === 'jewelry' ? 2.65 : 2.30;
                                                            setCurrentProduct({
                                                                ...currentProduct,
                                                                raw_price: rawPrice,
                                                                base_price: Math.round(rawPrice * markup)
                                                            });
                                                        }}
                                                        className="w-full px-5 py-3 bg-white border border-slate-100 rounded-xl text-slate-900 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Selling Price (Selling ₱)</label>
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            value={currentProduct?.base_price || 0}
                                                            className="w-full px-5 py-3 bg-primary/5 border border-primary/10 rounded-xl text-primary font-bold outline-none cursor-default"
                                                            readOnly
                                                        />
                                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] text-primary/60 font-bold uppercase">Auto</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Feature Image URL</label>
                                            <input
                                                type="text"
                                                value={currentProduct?.image_url || ''}
                                                onChange={(e) => setCurrentProduct({ ...currentProduct, image_url: e.target.value })}
                                                className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all placeholder:text-slate-300"
                                                placeholder="https://example.com/image.jpg"
                                            />
                                        </div>

                                        <div className="flex flex-wrap gap-8 pt-2">
                                            <label className="relative flex items-center gap-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={currentProduct?.popular || false}
                                                    onChange={(e) => setCurrentProduct({ ...currentProduct, popular: e.target.checked })}
                                                    className="w-5 h-5 rounded-lg border-2 border-slate-200 text-primary focus:ring-primary/20 transition-all accent-primary scale-110"
                                                />
                                                <span className="text-sm font-semibold text-slate-600 group-hover:text-primary transition-colors">Customers' Favorite</span>
                                            </label>
                                            <label className="relative flex items-center gap-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={currentProduct?.is_new_arrival || false}
                                                    onChange={(e) => setCurrentProduct({ ...currentProduct, is_new_arrival: e.target.checked })}
                                                    className="w-5 h-5 rounded-lg border-2 border-slate-200 text-primary focus:ring-primary/20 transition-all accent-primary scale-110"
                                                />
                                                <span className="text-sm font-semibold text-slate-600 group-hover:text-primary transition-colors">New Arrival</span>
                                            </label>
                                            <label className="relative flex items-center gap-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={currentProduct?.available || false}
                                                    onChange={(e) => setCurrentProduct({ ...currentProduct, available: e.target.checked })}
                                                    className="w-5 h-5 rounded-lg border-2 border-slate-200 text-primary focus:ring-primary/20 transition-all accent-primary scale-110"
                                                />
                                                <span className="text-sm font-semibold text-slate-600 group-hover:text-primary transition-colors">In Stock</span>
                                            </label>
                                            <label className="relative flex items-center gap-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={currentProduct?.discount_active || false}
                                                    onChange={(e) => setCurrentProduct({ ...currentProduct, discount_active: e.target.checked })}
                                                    className="w-5 h-5 rounded-lg border-2 border-slate-200 text-primary focus:ring-primary/20 transition-all accent-primary scale-110"
                                                />
                                                <span className="text-sm font-semibold text-slate-600 group-hover:text-primary transition-colors">Special Offer</span>
                                            </label>
                                        </div>

                                        {currentProduct?.discount_active && (
                                            <div className="bg-amber-50/50 p-6 rounded-3xl border border-amber-100 animate-in slide-in-from-top-4 duration-300">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-amber-600 ml-1">Discounted Price (₱)</label>
                                                    <input
                                                        type="number"
                                                        value={currentProduct?.discount_price || 0}
                                                        onChange={(e) => setCurrentProduct({ ...currentProduct, discount_price: parseFloat(e.target.value) })}
                                                        className="w-full px-5 py-3 bg-white border border-amber-200 rounded-2xl text-amber-900 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t border-slate-50">
                                            <button
                                                type="button"
                                                onClick={() => setIsEditing(false)}
                                                className="w-full sm:w-auto px-10 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 bg-slate-50 hover:bg-slate-100 hover:text-slate-600 rounded-2xl transition-all"
                                            >
                                                Discard
                                            </button>
                                            <button
                                                type="submit"
                                                className="w-full sm:w-auto px-12 py-4 bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all rounded-2xl font-bold uppercase tracking-[0.2em] text-xs"
                                            >
                                                Publish Product
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* Category Edit Modal */}
                {
                    isEditingCategory && (
                        <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                            <div className="bg-white w-full max-w-md max-h-[95vh] overflow-y-auto rounded-3xl shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-300">
                                <div className="p-6 sm:p-10">
                                    <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-6">
                                        <div>
                                            <h3 className="font-bold text-2xl text-slate-900">{currentCategory?.id ? 'Edit Category' : 'Add New Category'}</h3>
                                            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Category Details</p>
                                        </div>
                                        <button onClick={() => setIsEditingCategory(false)} className="bg-slate-50 hover:bg-slate-100 text-slate-400 p-2.5 rounded-full transition-all">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSaveCategory} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Category Name</label>
                                            <input
                                                type="text"
                                                value={currentCategory?.name || ''}
                                                onChange={(e) => {
                                                    const name = e.target.value;
                                                    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-t-]/g, '');
                                                    setCurrentCategory({ ...currentCategory, name, slug });
                                                }}
                                                className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all placeholder:text-slate-300"
                                                placeholder="e.g. Rings"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2 opacity-60">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Slug (URL)</label>
                                            <input
                                                type="text"
                                                value={currentCategory?.slug || ''}
                                                className="w-full px-5 py-3 bg-slate-100 border border-slate-100 rounded-2xl text-slate-500 outline-none cursor-not-allowed font-mono text-xs"
                                                readOnly
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Sort Order</label>
                                            <input
                                                type="number"
                                                value={currentCategory?.sort_order || 0}
                                                onChange={(e) => setCurrentCategory({ ...currentCategory, sort_order: parseInt(e.target.value) })}
                                                className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Category Image</label>
                                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                {currentCategory?.image_url && !categoryImageFile && (
                                                    <img src={currentCategory.image_url} alt="" className="w-16 h-16 object-cover rounded-xl shadow-sm" />
                                                )}
                                                {categoryImageFile && (
                                                    <div className="w-16 h-16 bg-primary/10 flex items-center justify-center rounded-xl">
                                                        <Upload className="w-6 h-6 text-primary" />
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => setCategoryImageFile(e.target.files?.[0] || null)}
                                                        className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-primary file:text-white hover:file:bg-primary/90 transition-all cursor-pointer"
                                                    />
                                                    {categoryImageFile && <p className="text-[10px] text-primary font-bold mt-2 italic">{categoryImageFile.name}</p>}
                                                </div>
                                            </div>
                                        </div>

                                        <label className="relative flex items-center gap-3 cursor-pointer group py-2">
                                            <input
                                                type="checkbox"
                                                checked={currentCategory?.active !== false}
                                                onChange={(e) => setCurrentCategory({ ...currentCategory, active: e.target.checked })}
                                                className="w-5 h-5 rounded-lg border-2 border-slate-200 text-primary focus:ring-primary/20 transition-all accent-primary scale-110"
                                            />
                                            <span className="text-sm font-semibold text-slate-600 group-hover:text-primary transition-colors">Visible in Storefront</span>
                                        </label>

                                        <div className="flex justify-end gap-3 pt-8 border-t border-slate-50">
                                            <button
                                                type="button"
                                                onClick={() => setIsEditingCategory(false)}
                                                className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isUploading}
                                                className="px-10 py-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all font-bold uppercase tracking-widest text-xs disabled:opacity-50"
                                            >
                                                {isUploading ? 'Uploading...' : 'Save Category'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* Payment Method Edit Modal */}
                {
                    isEditingPayment && (
                        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-300">
                                <div className="p-8">
                                    <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-6">
                                        <div>
                                            <h3 className="font-bold text-2xl text-slate-900">{currentPaymentMethod?.id ? 'Edit Payment Method' : 'Add New Payment Method'}</h3>
                                            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Billing Configuration</p>
                                        </div>
                                        <button onClick={() => setIsEditingPayment(false)} className="bg-slate-50 hover:bg-slate-100 text-slate-400 p-2 rounded-full transition-all">
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSavePaymentMethod} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Method Name</label>
                                            <input
                                                type="text"
                                                value={currentPaymentMethod?.name || ''}
                                                onChange={(e) => setCurrentPaymentMethod({ ...currentPaymentMethod, name: e.target.value })}
                                                className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all placeholder:text-slate-300"
                                                placeholder="e.g. GCash"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Account Name</label>
                                            <input
                                                type="text"
                                                value={currentPaymentMethod?.account_name || ''}
                                                onChange={(e) => setCurrentPaymentMethod({ ...currentPaymentMethod, account_name: e.target.value })}
                                                className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all placeholder:text-slate-300"
                                                placeholder="Full Name"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Account Number</label>
                                            <input
                                                type="text"
                                                value={currentPaymentMethod?.account_number || ''}
                                                onChange={(e) => setCurrentPaymentMethod({ ...currentPaymentMethod, account_number: e.target.value })}
                                                className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all font-mono text-sm placeholder:text-slate-300"
                                                placeholder="09xx-xxx-xxxx"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">QR Code URL</label>
                                            <input
                                                type="text"
                                                value={currentPaymentMethod?.qr_code_url || ''}
                                                onChange={(e) => setCurrentPaymentMethod({ ...currentPaymentMethod, qr_code_url: e.target.value })}
                                                className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all placeholder:text-slate-300"
                                                placeholder="https://example.com/qr.jpg"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Sort Order</label>
                                                <input
                                                    type="number"
                                                    value={currentPaymentMethod?.sort_order || 0}
                                                    onChange={(e) => setCurrentPaymentMethod({ ...currentPaymentMethod, sort_order: parseInt(e.target.value) })}
                                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all"
                                                    required
                                                />
                                            </div>
                                            <div className="flex items-end pb-3">
                                                <label className="relative flex items-center gap-3 cursor-pointer group">
                                                    <input
                                                        type="checkbox"
                                                        checked={currentPaymentMethod?.active !== false}
                                                        onChange={(e) => setCurrentPaymentMethod({ ...currentPaymentMethod, active: e.target.checked })}
                                                        className="w-5 h-5 rounded-lg border-2 border-slate-200 text-primary focus:ring-primary/20 transition-all accent-primary scale-110"
                                                    />
                                                    <span className="text-sm font-semibold text-slate-600 group-hover:text-primary transition-colors">Active</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-3 pt-8 border-t border-slate-50">
                                            <button
                                                type="button"
                                                onClick={() => setIsEditingPayment(false)}
                                                className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-10 py-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all font-bold uppercase tracking-widest text-xs"
                                            >
                                                Save Method
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* Hero Slide Edit Modal */}
                {
                    isEditingHero && (
                        <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                            <div className="bg-white w-full max-w-xl max-h-[95vh] overflow-y-auto rounded-3xl shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-300">
                                <div className="p-6 sm:p-10">
                                    <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-6">
                                        <div>
                                            <h3 className="font-bold text-2xl text-slate-900">{currentHeroSlide?.id ? 'Edit Hero Slide' : 'Add New Hero Slide'}</h3>
                                            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Banner Configuration</p>
                                        </div>
                                        <button onClick={() => setIsEditingHero(false)} className="bg-slate-50 hover:bg-slate-100 text-slate-400 p-2.5 rounded-full transition-all">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSaveHeroSlide} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Main Title</label>
                                                <input
                                                    type="text"
                                                    value={currentHeroSlide?.title || ''}
                                                    onChange={(e) => setCurrentHeroSlide({ ...currentHeroSlide, title: e.target.value })}
                                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all"
                                                    placeholder="Hero Title"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Subtitle / Top Tag</label>
                                                <input
                                                    type="text"
                                                    value={currentHeroSlide?.subtitle || ''}
                                                    onChange={(e) => setCurrentHeroSlide({ ...currentHeroSlide, subtitle: e.target.value })}
                                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all"
                                                    placeholder="e.g. Luxury Collection"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">CTA Button Text</label>
                                                <input
                                                    type="text"
                                                    value={currentHeroSlide?.cta_text || ''}
                                                    onChange={(e) => setCurrentHeroSlide({ ...currentHeroSlide, cta_text: e.target.value })}
                                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all"
                                                    placeholder="Shop Now"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">CTA Link</label>
                                                <input
                                                    type="text"
                                                    value={currentHeroSlide?.cta_link || ''}
                                                    onChange={(e) => setCurrentHeroSlide({ ...currentHeroSlide, cta_link: e.target.value })}
                                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all"
                                                    placeholder="/shop"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Banner Image</label>
                                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                {currentHeroSlide?.image_url && !heroImageFile && (
                                                    <img src={currentHeroSlide.image_url} alt="" className="w-20 h-12 object-cover rounded-lg shadow-sm" />
                                                )}
                                                {heroImageFile && (
                                                    <div className="w-20 h-12 bg-primary/10 flex items-center justify-center rounded-lg">
                                                        <Upload className="w-5 h-5 text-primary" />
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => setHeroImageFile(e.target.files?.[0] || null)}
                                                        className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-primary file:text-white hover:file:bg-primary/90 transition-all cursor-pointer"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Sort Order</label>
                                                <input
                                                    type="number"
                                                    value={currentHeroSlide?.sort_order || 0}
                                                    onChange={(e) => setCurrentHeroSlide({ ...currentHeroSlide, sort_order: parseInt(e.target.value) })}
                                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all"
                                                />
                                            </div>
                                            <div className="flex items-end pb-3">
                                                <label className="relative flex items-center gap-3 cursor-pointer group">
                                                    <input
                                                        type="checkbox"
                                                        checked={currentHeroSlide?.active !== false}
                                                        onChange={(e) => setCurrentHeroSlide({ ...currentHeroSlide, active: e.target.checked })}
                                                        className="w-5 h-5 rounded-lg border-2 border-slate-200 text-primary focus:ring-primary/20 transition-all accent-primary scale-110"
                                                    />
                                                    <span className="text-sm font-semibold text-slate-600 group-hover:text-primary transition-colors">Published</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-3 pt-8 border-t border-slate-50">
                                            <button
                                                type="button"
                                                onClick={() => setIsEditingHero(false)}
                                                className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isUploading}
                                                className="px-10 py-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all font-bold uppercase tracking-widest text-xs disabled:opacity-50"
                                            >
                                                {isUploading ? 'Uploading...' : 'Save Banner'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* Order Details Modal */}
                {
                    viewingOrder && (
                        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                            <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-auto rounded-3xl shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-300">
                                <div className="p-8 sm:p-10">
                                    <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-8">
                                        <div>
                                            <h3 className="font-bold text-2xl text-slate-900">Order Details</h3>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">ID: {viewingOrder.id}</p>
                                        </div>
                                        <button onClick={() => setViewingOrder(null)} className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-full transition-all">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
                                        <div className="space-y-6">
                                            <div>
                                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div> Customer Information
                                                </h4>
                                                <div className="bg-slate-50 p-6 rounded-2xl space-y-4 border border-slate-100">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Full Name</span>
                                                        <span className="text-sm font-bold text-slate-900">{viewingOrder.first_name} {viewingOrder.last_name}</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Email Address</span>
                                                        <a href={`mailto:${viewingOrder.email}`} className="text-sm font-bold text-primary hover:underline">{viewingOrder.email}</a>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Phone Number</span>
                                                        <a href={`tel:${viewingOrder.phone}`} className="text-sm font-bold text-slate-900 hover:text-primary transition-colors">{viewingOrder.phone}</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div> Shipping & Payment
                                                </h4>
                                                <div className="bg-slate-50 p-6 rounded-2xl space-y-4 border border-slate-100">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Full Address</span>
                                                        <span className="text-sm font-bold text-slate-900">{viewingOrder.address}</span>
                                                        <span className="text-xs text-slate-500">{viewingOrder.city}, {viewingOrder.postal_code}</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Payment Method</span>
                                                        <span className="text-sm font-bold uppercase text-primary tracking-wide">{viewingOrder.payment_method}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {viewingOrder.payment_proof_url && (
                                        <div className="mb-10">
                                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div> Proof of Payment
                                            </h4>
                                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                <a href={viewingOrder.payment_proof_url} target="_blank" rel="noopener noreferrer" className="block relative group overflow-hidden rounded-xl border border-slate-200 hover:border-primary/50 transition-all">
                                                    <img
                                                        src={viewingOrder.payment_proof_url}
                                                        alt="Proof of Payment"
                                                        className="w-full max-h-80 object-contain bg-white"
                                                    />
                                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                                        <span className="text-white text-[10px] font-bold uppercase tracking-[0.2em] border-2 border-white px-6 py-3 rounded-full hover:bg-white hover:text-slate-900 transition-all">View Full Entry</span>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mb-10">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div> Itemized Summary
                                        </h4>
                                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                                            <table className="min-w-full divide-y divide-slate-50">
                                                <thead className="bg-slate-50/50">
                                                    <tr>
                                                        <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product</th>
                                                        <th className="px-6 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Qty</th>
                                                        <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price</th>
                                                        <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Subtotal</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50">
                                                    {viewingOrder.order_items?.map((item) => (
                                                        <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                                                            <td className="px-6 py-5 font-bold text-slate-900">{item.product_name}</td>
                                                            <td className="px-6 py-5 text-center text-slate-500 font-medium">{item.quantity}</td>
                                                            <td className="px-6 py-5 text-right text-slate-500 font-medium">₱{item.price.toLocaleString()}</td>
                                                            <td className="px-6 py-5 text-right font-bold text-slate-900">₱{(item.price * item.quantity).toLocaleString()}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot className="bg-slate-50/50 border-t border-slate-100">
                                                    <tr>
                                                        <td colSpan={3} className="px-6 py-3 text-right text-[10px] text-slate-400 uppercase font-bold tracking-widest">Delivery Fee</td>
                                                        <td className="px-6 py-3 text-right text-sm font-bold text-slate-900">₱{(viewingOrder.shipping_fee || 0).toLocaleString()}</td>
                                                    </tr>
                                                    <tr className="bg-primary/5">
                                                        <td colSpan={3} className="px-6 py-5 text-right text-[10px] uppercase font-bold tracking-[0.2em] text-primary">Total Amount Settled</td>
                                                        <td className="px-6 py-5 text-right text-xl font-bold text-primary">₱{viewingOrder.total_amount.toLocaleString()}</td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-between items-center pt-10 border-t border-slate-50 gap-6">
                                        <button
                                            onClick={() => handleDeleteOrder(viewingOrder.id)}
                                            className="text-[10px] font-bold uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors flex items-center gap-2 group"
                                        >
                                            <Trash2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> Permanently Delete
                                        </button>
                                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                                            <button
                                                onClick={() => setViewingOrder(null)}
                                                className="px-10 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all"
                                            >
                                                Dismiss
                                            </button>
                                            <div className="relative group">
                                                <select
                                                    value={viewingOrder.status}
                                                    onChange={(e) => handleUpdateOrderStatus(viewingOrder.id, e.target.value as Order['status'])}
                                                    className="w-full sm:w-auto appearance-none pl-10 pr-12 py-4 text-[10px] font-bold uppercase tracking-[0.2em] bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl transition-all outline-none cursor-pointer"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                                <ListChecks className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" />
                                                <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none rotate-90" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* Quotation Setting Edit Modal */}
                {
                    isEditingQuotationSetting && (
                        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-300">
                                <div className="p-8">
                                    <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-6">
                                        <div>
                                            <h3 className="font-bold text-2xl text-slate-900">Edit Setting</h3>
                                            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Quotation Configuration</p>
                                        </div>
                                        <button onClick={() => setIsEditingQuotationSetting(false)} className="bg-slate-50 hover:bg-slate-100 text-slate-400 p-2 rounded-full transition-all">
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSaveQuotationSetting} className="space-y-6">
                                        <div className="space-y-6">
                                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-[0.2em] block mb-2">Setting Name</span>
                                                <span className="text-lg font-bold text-slate-900">{currentQuotationSetting?.label}</span>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Setting Value</label>
                                                {typeof currentQuotationSetting?.value === 'number' ? (
                                                    <input
                                                        type="number"
                                                        value={currentQuotationSetting.value}
                                                        onChange={(e) => setCurrentQuotationSetting({ ...currentQuotationSetting, value: parseFloat(e.target.value) })}
                                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all"
                                                        required
                                                    />
                                                ) : (
                                                    <input
                                                        type="text"
                                                        value={typeof currentQuotationSetting?.value === 'string' ? currentQuotationSetting.value : JSON.stringify(currentQuotationSetting?.value)}
                                                        onChange={(e) => {
                                                            let val: any = e.target.value;
                                                            try {
                                                                val = JSON.parse(e.target.value);
                                                            } catch (e) { }
                                                            setCurrentQuotationSetting({ ...currentQuotationSetting, value: val });
                                                        }}
                                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all font-mono text-sm"
                                                        required
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-3 pt-8 border-t border-slate-50">
                                            <button
                                                type="button"
                                                onClick={() => setIsEditingQuotationSetting(false)}
                                                className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                                            >
                                                Discard
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-10 py-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all font-bold uppercase tracking-widest text-xs"
                                            >
                                                Save Updates
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* Quotation Detail Modal */}
                {
                    viewingQuotation && (
                        <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                            <div className="bg-white w-full max-w-4xl max-h-[95vh] overflow-y-auto rounded-3xl shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-300">
                                <div className="p-6 sm:p-10">
                                    <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-8">
                                        <div>
                                            <h3 className="font-bold text-2xl text-slate-900">Quotation Inquiry</h3>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">ID: {viewingQuotation.id}</p>
                                        </div>
                                        <button onClick={() => setViewingQuotation(null)} className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-full transition-all">
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
                                        <div className="space-y-6">
                                            <div>
                                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div> Contact Information
                                                </h4>
                                                <div className="bg-slate-50 p-6 rounded-2xl space-y-4 border border-slate-100">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Preferred Method</span>
                                                        <span className="text-sm font-bold text-primary uppercase tracking-wide">{viewingQuotation.form_data?.preferredComm || 'Email'}</span>
                                                    </div>
                                                    {viewingQuotation.form_data?.socialHandle && (
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                                                                {viewingQuotation.form_data?.preferredComm} Handle
                                                            </span>
                                                            <span className="text-sm font-bold text-slate-900">
                                                                {viewingQuotation.form_data?.preferredComm === 'Instagram' ? '@' : ''}
                                                                {viewingQuotation.form_data?.socialHandle}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Full Name</span>
                                                        <span className="text-sm font-bold text-slate-900">{viewingQuotation.customer_name}</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Email Address</span>
                                                        <a href={`mailto:${viewingQuotation.customer_email}`} className="text-sm font-bold text-primary hover:underline">{viewingQuotation.customer_email}</a>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Phone Number</span>
                                                        <a href={`tel:${viewingQuotation.customer_phone}`} className="text-sm font-bold text-slate-900 hover:text-primary transition-colors">{viewingQuotation.customer_phone}</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div> Quotation Summary
                                                </h4>
                                                <div className="bg-slate-50 p-6 rounded-2xl space-y-4 border border-slate-100">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Inquiry Path</span>
                                                        <span className="text-sm font-bold text-slate-900 capitalize">{viewingQuotation.path.replace('_', ' ')}</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Estimated Budget</span>
                                                        <span className="text-sm font-bold text-primary">₱{viewingQuotation.final_price_low.toLocaleString()} - ₱{viewingQuotation.final_price_high.toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Quality Tier</span>
                                                        <span className="text-sm font-bold text-slate-900">{viewingQuotation.tier}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-10">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div> Detailed Requirements
                                        </h4>
                                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                                            {Object.entries(viewingQuotation.form_data || {}).map(([key, value]: [string, any]) => (
                                                key !== 'inspirationFiles' && key !== 'socialHandle' && key !== 'preferredComm' && (
                                                    <div key={key} className="flex flex-col border-b border-slate-100 pb-2">
                                                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                        <span className="text-sm font-bold text-slate-900">{Array.isArray(value) ? value.join(', ') : String(value)}</span>
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-10 border-t border-slate-50">
                                        <button
                                            onClick={() => setViewingQuotation(null)}
                                            className="px-12 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all"
                                        >
                                            Dismiss Inquiry
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div >
        </div >
    );
}



