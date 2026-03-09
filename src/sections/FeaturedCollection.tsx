import { useState, useEffect } from 'react';
import { SectionTitle } from '@/components/SectionTitle';
import { ProductCard } from '@/components/ProductCard';
import { useSupabase } from '@/hooks/useSupabase';
import type { Product } from '@/types';

export function FeaturedCollection() {
  const { getProducts } = useSupabase();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    };
    loadProducts();
  }, []);

  const displayProducts = products.filter(p => p.is_new_arrival).slice(0, 4);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <SectionTitle title="New Arrivals" subtitle="LATEST ADDITIONS" />

        {loading ? (
          <div className="text-center py-10 italic">Loading collection...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <a href="#shop" className="btn-secondary">
            View all new arrivals
          </a>
        </div>
      </div>
    </section>
  );
}
