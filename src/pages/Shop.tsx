import { useState, useEffect } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { useSupabase } from '@/hooks/useSupabase';
import type { Product, Category } from '@/types';

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
];

interface ShopProps {
  initialCategory?: string | null;
}

export function Shop({ initialCategory }: ShopProps) {
  const { getProducts, getCategories, loading } = useSupabase();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'All');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    const loadData = async () => {
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    };
    loadData();
  }, []);

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const getPrice = (p: Product) => p.discount_active && p.discount_price ? p.discount_price : p.base_price;
    const priceA = getPrice(a);
    const priceB = getPrice(b);

    switch (sortBy) {
      case 'price-low':
        return priceA - priceB;
      case 'price-high':
        return priceB - priceA;
      case 'newest':
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      default:
        return 0;
    }
  });

  return (
    <div id="all-products" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="section-title mb-4">Shop All</h1>
        <p className="text-center text-muted-foreground mb-8">
          Discover our collection of fine jewelry, handcrafted with passion
        </p>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 text-sm transition-colors ${selectedCategory === 'All'
                  ? 'bg-gold text-primary-dark font-medium'
                  : 'border border-white/20 text-muted-foreground hover:border-gold hover:text-white'
                }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 text-sm transition-colors ${selectedCategory === category.id
                    ? 'bg-gold text-primary-dark font-medium'
                    : 'border border-white/20 text-muted-foreground hover:border-gold hover:text-white'
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/20 text-white text-sm focus:border-gold focus:outline-none"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-primary-dark text-white">
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground mb-6">
          {loading ? 'Loading products...' : `Showing ${sortedProducts.length} products`}
        </p>

        {/* Products Grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {sortedProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
