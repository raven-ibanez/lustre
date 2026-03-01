import { SectionTitle } from '@/components/SectionTitle';

const lookProduct = {
  id: '9',
  name: 'Royal Eternity Band',
  base_price: 6200,
  available: false,
};

export function ShopTheLook() {

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-PH');
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
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
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:bottom-8 sm:left-8 bg-primary-dark p-4 max-w-xs border border-gold/20">
              {!lookProduct.available && (
                <span className="badge-sold-out static mb-2">Sold out</span>
              )}
              <h3 className="text-sm font-medium mt-2">{lookProduct.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                ₱{formatPrice(lookProduct.base_price)}
              </p>
              <a
                href={`#shop`}
                className="text-xs uppercase tracking-wider underline mt-3 inline-block hover:no-underline"
              >
                Shop this look
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
