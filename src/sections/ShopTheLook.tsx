import { useState } from 'react';
import { SectionTitle } from '@/components/SectionTitle';
import { products } from '@/data/products';

export function ShopTheLook() {
  const [currentLook, setCurrentLook] = useState(0);
  const lookProduct = products[8];

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-PH');
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-forest">
      <div className="max-w-7xl mx-auto">
        <SectionTitle title="Styled by You" />

        <div className="relative animate-fade-in">
          {/* Main Image */}
          <div className="relative aspect-video overflow-hidden">
            <img
              src="/images/shop-the-look.jpg"
              alt="Lustre Lab Styled Look"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />

            {/* Product Overlay */}
            <div className="absolute bottom-8 left-8 bg-white p-4 max-w-xs">
              {lookProduct.isSoldOut && (
                <span className="badge-sold-out static mb-2">Sold out</span>
              )}
              <h3 className="text-sm font-medium mt-2">{lookProduct.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {lookProduct.currency}{formatPrice(lookProduct.price)}
              </p>
              <a
                href={`#product-${lookProduct.id}`}
                className="text-xs uppercase tracking-wider underline mt-3 inline-block hover:no-underline"
              >
                Shop this look
              </a>
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {[0, 1, 2, 3].map((index) => (
              <button
                key={index}
                onClick={() => setCurrentLook(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentLook ? 'bg-white w-6' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
