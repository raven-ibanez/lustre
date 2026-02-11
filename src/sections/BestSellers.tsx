import { SectionTitle } from '@/components/SectionTitle';
import { ProductCard } from '@/components/ProductCard';
import { products } from '@/data/products';

export function BestSellers() {
  const bestSellers = products.filter(p => !p.isSoldOut).slice(6, 10);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <SectionTitle title="Customer Favorites" subtitle="MOST LOVED PIECES" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {bestSellers.map((product, index) => (
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
            Shop all favorites
          </a>
        </div>
      </div>
    </section>
  );
}
