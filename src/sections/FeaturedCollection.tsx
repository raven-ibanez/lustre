import { SectionTitle } from '@/components/SectionTitle';
import { ProductCard } from '@/components/ProductCard';
import { products } from '@/data/products';

export function FeaturedCollection() {
  const newArrivals = products.filter(p => p.badge === 'new').slice(0, 4);
  const displayProducts = newArrivals.length > 0 ? newArrivals : products.slice(4, 8);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <SectionTitle title="New Arrivals" subtitle="LATEST ADDITIONS" />

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

        <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <a href="#shop" className="btn-secondary">
            View all new arrivals
          </a>
        </div>
      </div>
    </section>
  );
}
