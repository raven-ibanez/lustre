import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Product, Category, Order, PaymentMethod } from '@/types';
import { Plus, Edit, Trash2, X, Package, ShoppingCart, BarChart3, TrendingUp, DollarSign, Wallet, Upload } from 'lucide-react';

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
    const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'orders' | 'analytics' | 'payments'>('products');

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

            if (productsError) throw productsError;
            if (categoriesError) throw categoriesError;
            if (ordersError) throw ordersError;
            if (paymentsError) throw paymentsError;

            setProducts(productsData || []);
            setCategories(categoriesData || []);
            setOrders(ordersData || []);
            setPaymentMethods(paymentsData || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
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

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-card p-8 shadow-sm border border-white/10">
                    <div className="text-center mb-8">
                        <h2 className="font-serif text-3xl mb-2">Admin Login</h2>
                        <p className="text-muted-foreground">Enter your password to continue</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <input
                                type="password"
                                placeholder="Admin Password"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                className={`w-full px-4 py-3 border ${loginError ? 'border-red-500' : 'border-white/10'} bg-white/5 text-white focus:border-gold outline-none transition-colors`}
                                required
                            />
                            {loginError && <p className="text-red-500 text-xs mt-1">Incorrect password</p>}
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-serif text-3xl">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Manage your shop content and logic</p>
                </div>
                <div className="flex gap-4">
                    {activeTab === 'products' ? (
                        <button
                            onClick={() => {
                                setCurrentProduct({
                                    name: '',
                                    description: '',
                                    base_price: 0,
                                    category: categories[0]?.id || '',
                                    popular: false,
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
                    ) : null}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10 mb-8">
                <button
                    onClick={() => setActiveTab('products')}
                    className={`px-6 py-3 font-medium transition-colors border-b-2 ${activeTab === 'products' ? 'border-gold text-gold' : 'border-transparent text-muted-foreground hover:text-white'}`}
                >
                    Products ({products.length})
                </button>
                <button
                    onClick={() => setActiveTab('categories')}
                    className={`px-6 py-3 font-medium transition-colors border-b-2 ${activeTab === 'categories' ? 'border-gold text-gold' : 'border-transparent text-muted-foreground hover:text-white'}`}
                >
                    Categories ({categories.length})
                </button>
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`px-6 py-3 font-medium transition-colors border-b-2 ${activeTab === 'orders' ? 'border-gold text-gold' : 'border-transparent text-muted-foreground hover:text-white'}`}
                >
                    Orders ({orders.length})
                </button>
                <button
                    onClick={() => setActiveTab('analytics')}
                    className={`px-6 py-3 font-medium transition-colors border-b-2 ${activeTab === 'analytics' ? 'border-gold text-gold' : 'border-transparent text-muted-foreground hover:text-white'}`}
                >
                    Analytics
                </button>
                <button
                    onClick={() => setActiveTab('payments')}
                    className={`px-6 py-3 font-medium transition-colors border-b-2 ${activeTab === 'payments' ? 'border-gold text-gold' : 'border-transparent text-muted-foreground hover:text-white'}`}
                >
                    Payments
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20 italic">Loading dashboard...</div>
            ) : error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-md mb-8">Error: {error}</div>
            ) : activeTab === 'products' ? (
                <div className="bg-card shadow-sm border border-white/10 overflow-hidden">
                    <table className="min-w-full divide-y divide-white/10">
                        <thead className="bg-white/5">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-transparent divide-y divide-white/10 text-sm">
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {product.image_url ? (
                                                <img className="h-10 w-10 object-cover mr-3" src={product.image_url} alt="" />
                                            ) : (
                                                <div className="h-10 w-10 bg-white/5 flex items-center justify-center mr-3">
                                                    <Package className="w-5 h-5 text-muted-foreground" />
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-medium text-white">{product.name}</div>
                                                {product.popular && <span className="text-[10px] bg-gold/10 text-gold px-1.5 py-0.5 rounded uppercase">Popular</span>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                                        {categories.find(c => c.id === product.category)?.name || product.category}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                                        ₱{product.base_price.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.available ? 'bg-gold/10 text-gold' : 'bg-red-100/10 text-red-400'}`}>
                                            {product.available ? 'Available' : 'Out of Stock'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                                        <button
                                            onClick={() => {
                                                setCurrentProduct(product);
                                                setIsEditing(true);
                                            }}
                                            className="text-gold hover:text-gold/80 mr-3"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProduct(product.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : activeTab === 'categories' ? (
                <div className="bg-card shadow-sm border border-white/10 overflow-hidden">
                    <table className="min-w-full divide-y divide-white/10">
                        <thead className="bg-white/5">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Category Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Slug</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Order</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-transparent divide-y divide-white/10 text-sm">
                            {categories.map((category) => (
                                <tr key={category.id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-white">
                                        {category.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                                        {category.slug}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-white">
                                        {category.sort_order}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${category.active ? 'bg-gold/10 text-gold' : 'bg-gray-100/10 text-gray-400'}`}>
                                            {category.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                                        <button
                                            onClick={() => {
                                                setCurrentCategory(category);
                                                setIsEditingCategory(true);
                                            }}
                                            className="text-gold hover:text-gold/80 mr-3"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCategory(category.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : activeTab === 'orders' ? (
                <div className="bg-card shadow-sm border border-white/10 overflow-hidden">
                    <table className="min-w-full divide-y divide-white/10">
                        <thead className="bg-white/5">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-transparent divide-y divide-white/10 text-sm">
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-muted-foreground">
                                        {order.id.slice(0, 8)}...
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-white font-medium">{order.first_name} {order.last_name}</div>
                                        <div className="text-muted-foreground text-xs">{order.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                                        ₱{order.total_amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                                            className={`px-2 py-1 text-xs font-semibold rounded-full bg-white/5 outline-none ${order.status === 'completed' ? 'text-gold' :
                                                order.status === 'cancelled' ? 'text-red-400' :
                                                    'text-blue-400'
                                                }`}
                                        >
                                            <option value="pending" className="bg-card">Pending</option>
                                            <option value="completed" className="bg-card">Completed</option>
                                            <option value="cancelled" className="bg-card">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                                        {new Date(order.created_at!).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                                        <button
                                            onClick={() => setViewingOrder(order)}
                                            className="text-gold hover:text-gold/80 mr-3"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleDeleteOrder(order.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : activeTab === 'payments' ? (
                <div className="bg-card shadow-sm border border-white/10 overflow-hidden">
                    <table className="min-w-full divide-y divide-white/10">
                        <thead className="bg-white/5">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Method Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Account Info</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">QR Code</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-transparent divide-y divide-white/10 text-sm">
                            {paymentMethods.map((method) => (
                                <tr key={method.id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-white">
                                        <div className="flex items-center gap-2">
                                            <Wallet className="w-4 h-4 text-gold" />
                                            {method.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                                        <div className="text-xs">{method.account_name}</div>
                                        <div className="font-mono text-[10px]">{method.account_number}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {method.qr_code_url ? (
                                            <img src={method.qr_code_url} alt="QR" className="h-10 w-10 object-contain border border-white/10 rounded bg-white" />
                                        ) : (
                                            <span className="text-[10px] text-muted-foreground italic">No QR</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${method.active ? 'bg-gold/10 text-gold' : 'bg-gray-100/10 text-gray-400'}`}>
                                            {method.active ? 'Active' : 'Hidden'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                                        <button
                                            onClick={() => {
                                                setCurrentPaymentMethod(method);
                                                setIsEditingPayment(true);
                                            }}
                                            className="text-gold hover:text-gold/80 mr-3"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeletePaymentMethod(method.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-card p-6 shadow-sm border border-white/10">
                            <div className="flex items-center justify-between mb-4">
                                <span className="p-2 bg-gold/10 rounded-lg"><DollarSign className="w-5 h-5 text-gold" /></span>
                            </div>
                            <h3 className="text-muted-foreground text-sm font-medium">Gross Sales</h3>
                            <p className="text-2xl font-serif mt-1 text-white">
                                ₱{orders
                                    .filter(o => o.status === 'completed')
                                    .reduce((sum, o) => sum + (o.order_items?.reduce((s, i) => s + (i.price * i.quantity), 0) || 0), 0)
                                    .toLocaleString()}
                            </p>
                            <p className="text-[10px] text-muted-foreground mt-1">Total Selling Price (Completed Orders)</p>
                        </div>
                        <div className="bg-card p-6 shadow-sm border border-white/10">
                            <div className="flex items-center justify-between mb-4">
                                <span className="p-2 bg-gold/10 rounded-lg"><TrendingUp className="w-5 h-5 text-gold" /></span>
                            </div>
                            <h3 className="text-muted-foreground text-sm font-medium">Net Profit</h3>
                            <p className="text-2xl font-serif mt-1 text-white">
                                ₱{orders
                                    .filter(o => o.status === 'completed')
                                    .reduce((sum, o) => {
                                        const gross = o.order_items?.reduce((s, i) => s + (i.price * i.quantity), 0) || 0;
                                        const raw = o.order_items?.reduce((s, i) => s + ((i.raw_price || 0) * i.quantity), 0) || 0;
                                        return sum + (gross - raw);
                                    }, 0)
                                    .toLocaleString()}
                            </p>
                            <p className="text-[10px] text-muted-foreground mt-1">Gross Sales - Total Raw Price</p>
                        </div>
                        <div className="bg-card p-6 shadow-sm border border-white/10">
                            <div className="flex items-center justify-between mb-4">
                                <span className="p-2 bg-blue-500/10 rounded-lg"><ShoppingCart className="w-5 h-5 text-blue-400" /></span>
                            </div>
                            <h3 className="text-muted-foreground text-sm font-medium">Total Orders</h3>
                            <p className="text-2xl font-serif mt-1 text-white">{orders.length}</p>
                            <p className="text-[10px] text-muted-foreground mt-1">All orders (Pending, Completed, Cancelled)</p>
                        </div>
                        <div className="bg-card p-6 shadow-sm border border-white/10">
                            <div className="flex items-center justify-between mb-4">
                                <span className="p-2 bg-amber-500/10 rounded-lg"><Package className="w-5 h-5 text-amber-400" /></span>
                            </div>
                            <h3 className="text-muted-foreground text-sm font-medium">Items Sold</h3>
                            <p className="text-2xl font-serif mt-1 text-white">
                                {orders.reduce((sum, o) => sum + (o.order_items?.reduce((s, i) => s + i.quantity, 0) || 0), 0)}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-card p-6 shadow-sm border border-white/10">
                            <h3 className="font-serif text-xl mb-6 text-white">Recent Order Activity</h3>
                            <div className="space-y-4">
                                {orders.slice(0, 5).map(order => (
                                    <div key={order.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gold/5 rounded-full flex items-center justify-center text-gold font-serif">
                                                {order.first_name[0]}{order.last_name[0]}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-white">{order.first_name} {order.last_name}</div>
                                                <div className="text-xs text-muted-foreground">{new Date(order.created_at!).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-medium text-white">₱{order.total_amount.toLocaleString()}</div>
                                            <div className="text-xs text-gold uppercase tracking-wider font-bold">{order.status}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-card p-6 shadow-sm border border-white/10">
                            <h3 className="font-serif text-xl mb-6 flex items-center gap-2 text-white">
                                <BarChart3 className="w-5 h-5 text-gold" /> Sales Performance
                            </h3>
                            <div className="h-64 flex items-end gap-2 px-4 pb-4">
                                {/* Simple CSS Bar Chart for last 7 orders */}
                                {orders.slice(0, 7).reverse().map((order, i) => {
                                    const maxAmount = Math.max(...orders.map(o => o.total_amount)) || 1;
                                    const height = (order.total_amount / maxAmount) * 100;
                                    return (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                                            <div className="absolute -top-8 bg-gold text-primary-dark text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                ₱{order.total_amount.toLocaleString()}
                                            </div>
                                            <div
                                                className="w-full bg-gold/20 group-hover:bg-gold transition-colors rounded-t"
                                                style={{ height: `${height}%` }}
                                            />
                                            <span className="text-[10px] text-muted-foreground rotate-45 origin-left">
                                                {new Date(order.created_at!).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Product Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-card w-full max-w-2xl max-h-[90vh] overflow-auto border border-white/10 shadow-2xl">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                                <h3 className="font-serif text-2xl text-white">{currentProduct?.id ? 'Edit Product' : 'Add New Product'}</h3>
                                <button onClick={() => setIsEditing(false)} className="text-muted-foreground hover:text-white transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveProduct} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Product Name</label>
                                        <input
                                            type="text"
                                            value={currentProduct?.name || ''}
                                            onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white focus:border-gold outline-none transition-colors"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</label>
                                        <select
                                            value={currentProduct?.category || ''}
                                            onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white focus:border-gold outline-none transition-colors"
                                            required
                                        >
                                            <option value="" className="bg-card">Select Category</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id} className="bg-card">{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</label>
                                    <textarea
                                        value={currentProduct?.description || ''}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white focus:border-gold outline-none transition-colors resize-none"
                                        rows={3}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Pricing Category</label>
                                        </div>
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
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white focus:border-gold outline-none transition-colors"
                                            required
                                        >
                                            <option value="jewelry" className="bg-card">Jewelry (+165%)</option>
                                            <option value="loose_stone" className="bg-card">Loose Stones (+130%)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Raw Price (Cost ₱)</label>
                                            <span className="text-[10px] text-muted-foreground">Internal only</span>
                                        </div>
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
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white focus:border-gold outline-none transition-colors"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Selling Price (Base ₱)</label>
                                            <span className="text-[10px] text-gold font-medium italic">Auto-calculated</span>
                                        </div>
                                        <input
                                            type="number"
                                            value={currentProduct?.base_price || 0}
                                            onChange={(e) => setCurrentProduct({ ...currentProduct, base_price: parseFloat(e.target.value) })}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 text-gold font-bold focus:border-gold outline-none"
                                            readOnly
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Image URL</label>
                                    <input
                                        type="text"
                                        value={currentProduct?.image_url || ''}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, image_url: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white focus:border-gold outline-none transition-colors"
                                    />
                                </div>

                                <div className="flex flex-wrap gap-6 pt-2">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={currentProduct?.popular || false}
                                            onChange={(e) => setCurrentProduct({ ...currentProduct, popular: e.target.checked })}
                                            className="w-4 h-4 accent-gold"
                                        />
                                        <span className="text-sm text-muted-foreground group-hover:text-white transition-colors">Popular Choice</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={currentProduct?.available || false}
                                            onChange={(e) => setCurrentProduct({ ...currentProduct, available: e.target.checked })}
                                            className="w-4 h-4 accent-gold"
                                        />
                                        <span className="text-sm text-muted-foreground group-hover:text-white transition-colors">Available in Stock</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={currentProduct?.discount_active || false}
                                            onChange={(e) => setCurrentProduct({ ...currentProduct, discount_active: e.target.checked })}
                                            className="w-4 h-4 accent-gold"
                                        />
                                        <span className="text-sm text-muted-foreground group-hover:text-white transition-colors">Enable Discount</span>
                                    </label>
                                </div>

                                {currentProduct?.discount_active && (
                                    <div className="bg-white/5 p-4 border border-white/5 space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Discount Price (₱)</label>
                                            <input
                                                type="number"
                                                value={currentProduct?.discount_price || 0}
                                                onChange={(e) => setCurrentProduct({ ...currentProduct, discount_price: parseFloat(e.target.value) })}
                                                className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white focus:border-gold outline-none transition-colors"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-6 py-2 border border-white/10 text-muted-foreground hover:bg-white/5 hover:text-white transition-colors uppercase tracking-widest text-[10px] font-bold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-8 py-2 bg-gold text-primary-dark hover:bg-gold/90 transition-colors font-bold uppercase tracking-widest text-xs"
                                    >
                                        Save Product
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Category Edit Modal */}
            {isEditingCategory && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-card w-full max-w-md overflow-auto border border-white/10 shadow-2xl">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                                <h3 className="font-serif text-2xl text-white">{currentCategory?.id ? 'Edit Category' : 'Add New Category'}</h3>
                                <button onClick={() => setIsEditingCategory(false)} className="text-muted-foreground hover:text-white transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveCategory} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category Name</label>
                                    <input
                                        type="text"
                                        value={currentCategory?.name || ''}
                                        onChange={(e) => {
                                            const name = e.target.value;
                                            const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-t-]/g, '');
                                            setCurrentCategory({ ...currentCategory, name, slug });
                                        }}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white focus:border-gold outline-none transition-colors"
                                        placeholder="e.g. Rings"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Slug</label>
                                    <input
                                        type="text"
                                        value={currentCategory?.slug || ''}
                                        onChange={(e) => setCurrentCategory({ ...currentCategory, slug: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 text-muted-foreground outline-none cursor-not-allowed"
                                        readOnly
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Sort Order</label>
                                    <input
                                        type="number"
                                        value={currentCategory?.sort_order || 0}
                                        onChange={(e) => setCurrentCategory({ ...currentCategory, sort_order: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white focus:border-gold outline-none transition-colors"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category Image</label>
                                    <div className="flex items-center gap-4">
                                        {currentCategory?.image_url && !categoryImageFile && (
                                            <img src={currentCategory.image_url} alt="" className="w-16 h-16 object-cover rounded" />
                                        )}
                                        {categoryImageFile && (
                                            <div className="w-16 h-16 bg-gold/10 flex items-center justify-center rounded">
                                                <Upload className="w-6 h-6 text-gold" />
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setCategoryImageFile(e.target.files?.[0] || null)}
                                            className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-gold file:text-primary-dark hover:file:bg-gold/90 transition-colors"
                                        />
                                    </div>
                                    {categoryImageFile && <p className="text-[10px] text-gold font-medium">{categoryImageFile.name} selected</p>}
                                </div>

                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={currentCategory?.active !== false}
                                        onChange={(e) => setCurrentCategory({ ...currentCategory, active: e.target.checked })}
                                        className="w-4 h-4 accent-gold"
                                    />
                                    <span className="text-sm text-muted-foreground group-hover:text-white transition-colors">Active (Visible in menu)</span>
                                </label>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditingCategory(false)}
                                        className="px-6 py-2 border border-white/10 text-muted-foreground hover:bg-white/5 hover:text-white transition-colors uppercase tracking-widest text-[10px] font-bold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isUploading}
                                        className="px-8 py-2 bg-gold text-primary-dark hover:bg-gold/90 transition-colors font-bold uppercase tracking-widest text-xs disabled:opacity-50"
                                    >
                                        {isUploading ? 'Uploading...' : 'Save Category'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Method Edit Modal */}
            {isEditingPayment && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-card w-full max-w-md border border-white/10 shadow-2xl">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                                <h3 className="font-serif text-2xl text-white">{currentPaymentMethod?.id ? 'Edit Payment Method' : 'Add New Payment Method'}</h3>
                                <button onClick={() => setIsEditingPayment(false)} className="text-muted-foreground hover:text-white transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSavePaymentMethod} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Method Name</label>
                                    <input
                                        type="text"
                                        value={currentPaymentMethod?.name || ''}
                                        onChange={(e) => setCurrentPaymentMethod({ ...currentPaymentMethod, name: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white focus:border-gold outline-none transition-colors"
                                        placeholder="e.g. GCash"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Account Name</label>
                                    <input
                                        type="text"
                                        value={currentPaymentMethod?.account_name || ''}
                                        onChange={(e) => setCurrentPaymentMethod({ ...currentPaymentMethod, account_name: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white focus:border-gold outline-none transition-colors"
                                        placeholder="Full Name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Account Number</label>
                                    <input
                                        type="text"
                                        value={currentPaymentMethod?.account_number || ''}
                                        onChange={(e) => setCurrentPaymentMethod({ ...currentPaymentMethod, account_number: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white focus:border-gold outline-none transition-colors font-mono"
                                        placeholder="09xx-xxx-xxxx"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">QR Code URL</label>
                                    <input
                                        type="text"
                                        value={currentPaymentMethod?.qr_code_url || ''}
                                        onChange={(e) => setCurrentPaymentMethod({ ...currentPaymentMethod, qr_code_url: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white focus:border-gold outline-none transition-colors"
                                        placeholder="Image URL"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Sort Order</label>
                                        <input
                                            type="number"
                                            value={currentPaymentMethod?.sort_order || 0}
                                            onChange={(e) => setCurrentPaymentMethod({ ...currentPaymentMethod, sort_order: parseInt(e.target.value) })}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white focus:border-gold outline-none transition-colors"
                                            required
                                        />
                                    </div>
                                    <div className="flex items-end pb-2">
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={currentPaymentMethod?.active !== false}
                                                onChange={(e) => setCurrentPaymentMethod({ ...currentPaymentMethod, active: e.target.checked })}
                                                className="w-4 h-4 accent-gold"
                                            />
                                            <span className="text-sm text-muted-foreground group-hover:text-white transition-colors">Active</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditingPayment(false)}
                                        className="px-6 py-2 border border-white/10 text-muted-foreground hover:bg-white/5 hover:text-white transition-colors uppercase tracking-widest text-[10px] font-bold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-8 py-2 bg-gold text-primary-dark hover:bg-gold/90 transition-colors font-bold uppercase tracking-widest text-xs"
                                    >
                                        Save Method
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Order Details Modal */}
            {viewingOrder && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-card w-full max-w-2xl max-h-[90vh] overflow-auto border border-white/10 shadow-2xl">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                                <div>
                                    <h3 className="font-serif text-2xl text-white">Order Details</h3>
                                    <p className="text-xs text-muted-foreground font-mono mt-1">ID: {viewingOrder.id}</p>
                                </div>
                                <button onClick={() => setViewingOrder(null)} className="p-1 text-muted-foreground hover:text-white transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-gold mb-3">Customer Info</h4>
                                        <div className="bg-white/5 p-4 space-y-3 border border-white/5">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-muted-foreground uppercase font-bold">Full Name</span>
                                                <span className="text-sm font-medium text-white">{viewingOrder.first_name} {viewingOrder.last_name}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-muted-foreground uppercase font-bold">Email Address</span>
                                                <a href={`mailto:${viewingOrder.email}`} className="text-sm font-medium text-gold hover:underline">{viewingOrder.email}</a>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-muted-foreground uppercase font-bold">Phone Number</span>
                                                <a href={`tel:${viewingOrder.phone}`} className="text-sm font-medium text-white hover:text-gold transition-colors">{viewingOrder.phone}</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-gold mb-3">Delivery Details</h4>
                                        <div className="bg-white/5 p-4 space-y-3 border border-white/5">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-muted-foreground uppercase font-bold">Street Address</span>
                                                <span className="text-sm font-medium text-white">{viewingOrder.address}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-muted-foreground uppercase font-bold">City & Postal Code</span>
                                                <span className="text-sm font-medium text-white">{viewingOrder.city}, {viewingOrder.postal_code}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-muted-foreground uppercase font-bold">Payment Method</span>
                                                <span className="text-sm font-medium uppercase text-gold">{viewingOrder.payment_method}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {viewingOrder.payment_proof_url && (
                                <div className="mb-8">
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-gold mb-3">Proof of Payment</h4>
                                    <div className="bg-white/5 p-4 border border-white/5">
                                        <a href={viewingOrder.payment_proof_url} target="_blank" rel="noopener noreferrer" className="block relative group overflow-hidden border border-white/10 hover:border-gold/50 transition-colors">
                                            <img
                                                src={viewingOrder.payment_proof_url}
                                                alt="Proof of Payment"
                                                className="w-full max-h-64 object-contain bg-white/5"
                                            />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-gold text-[10px] font-bold uppercase tracking-widest border border-gold px-4 py-2">View Full Size</span>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            )}

                            <div className="mb-8">
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gold mb-3">Order Items</h4>
                                <div className="border border-white/10 overflow-hidden">
                                    <table className="min-w-full divide-y divide-white/10">
                                        <thead className="bg-white/5">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Product</th>
                                                <th className="px-4 py-3 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Qty</th>
                                                <th className="px-4 py-3 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Price</th>
                                                <th className="px-4 py-3 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 text-sm">
                                            {viewingOrder.order_items?.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-4 py-4 font-medium">{item.product_name}</td>
                                                    <td className="px-4 py-4 text-center text-gray-500">{item.quantity}</td>
                                                    <td className="px-4 py-4 text-right text-gray-500">₱{item.price.toLocaleString()}</td>
                                                    <td className="px-4 py-4 text-right font-medium">₱{(item.price * item.quantity).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-white/5">
                                            <tr>
                                                <td colSpan={3} className="px-4 py-2 text-right text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Shipping Fee</td>
                                                <td className="px-4 py-2 text-right text-sm text-white">₱{(viewingOrder.shipping_fee || 0).toLocaleString()}</td>
                                            </tr>
                                            <tr className="text-gold">
                                                <td colSpan={3} className="px-4 py-4 text-right text-[10px] uppercase font-bold tracking-widest">Total Amount Paid</td>
                                                <td className="px-4 py-4 text-right text-lg font-serif">₱{viewingOrder.total_amount.toLocaleString()}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-white/5 gap-4">
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => handleDeleteOrder(viewingOrder.id)}
                                        className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors"
                                    >
                                        Delete Order
                                    </button>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                    <button
                                        onClick={() => setViewingOrder(null)}
                                        className="px-8 py-3 text-[10px] font-bold uppercase tracking-widest border border-white/10 text-muted-foreground hover:bg-white/5 hover:text-white transition-colors"
                                    >
                                        Dismiss
                                    </button>
                                    <select
                                        value={viewingOrder.status}
                                        onChange={(e) => handleUpdateOrderStatus(viewingOrder.id, e.target.value as Order['status'])}
                                        className="px-8 py-3 text-[10px] font-bold uppercase tracking-widest bg-gold text-primary-dark outline-none cursor-pointer hover:bg-gold/90 transition-colors"
                                    >
                                        <option value="pending" className="bg-card">Pending</option>
                                        <option value="completed" className="bg-card">Completed</option>
                                        <option value="cancelled" className="bg-card">Cancelled</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
