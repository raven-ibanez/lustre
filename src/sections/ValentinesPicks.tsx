import { SectionTitle } from '@/components/SectionTitle';
import { ProductCard } from '@/components/ProductCard';
import { products } from '@/data/products';

export function ValentinesPicks() {
  const featuredProducts = products.slice(0, 4);

  return (
    <section id="shop" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <SectionTitle title="Featured Collection" subtitle="BEST SELLERS" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product, index) => (
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
          <a href="#all-products" className="btn-secondary">
            View all products
          </a>
        </div>
      </div>
    </section>
  );
}
