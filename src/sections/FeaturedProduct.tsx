export function FeaturedProduct() {
  return (
    <section className="bg-background border-y border-white/5">
      <div className="grid md:grid-cols-2">
        {/* Image */}
        <div className="relative h-[500px] md:h-auto animate-slide-right">
          <img
            src="/images/hero-necklace.jpg"
            alt="Lustre Lab Featured Collection"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center px-8 md:px-16 py-16 animate-slide-left">
          <h2 className="font-serif text-3xl md:text-4xl mb-4">
            The Celestial Collection
          </h2>
          <p className="text-lg text-muted-foreground mb-6 italic">
            Where elegance meets the stars
          </p>
          <p className="text-sm leading-relaxed text-foreground mb-8">
            Discover our newest collection inspired by the beauty of the night sky. Each piece
            features carefully selected gemstones that capture the brilliance of celestial bodies.
            From delicate pendants to statement rings, the Celestial Collection offers something
            extraordinary for every jewelry lover.
          </p>
          <div>
            <a href="#shop" className="btn-primary inline-block">
              Shop Collection
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
