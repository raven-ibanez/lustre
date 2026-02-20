export function About() {
  return (
    <div id="about" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="section-title mb-12">Our Story</h1>

        {/* Hero Image */}
        <div className="aspect-video mb-12 overflow-hidden">
          <img
            src="/images/customization.jpg"
            alt="Lustre Lab Craftsmanship"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Story Content */}
        <div className="space-y-8 text-center">
          <p className="text-lg leading-relaxed">
            Lustre Lab was born from a passion for creating beautiful, meaningful jewelry
            that tells a story. Founded in Manila, Philippines, we set out to craft pieces
            that combine timeless elegance with modern sensibility.
          </p>

          <p className="text-muted-foreground leading-relaxed">
            Every piece in our collection is thoughtfully designed and meticulously handcrafted
            by skilled artisans who share our commitment to excellence. We believe that jewelry
            should not only be beautiful but also ethically made and built to last.
          </p>

          <p className="text-muted-foreground leading-relaxed">
            From our signature rings to our delicate necklaces, each creation reflects our
            dedication to quality craftsmanship and sustainable practices. We source our materials
            responsibly and work with local artisans to support our community.
          </p>
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-gold/10 border border-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gold text-2xl">&#10022;</span>
            </div>
            <h3 className="font-serif text-lg mb-2 text-gold">Quality</h3>
            <p className="text-sm text-muted-foreground">
              We use only the finest materials and craftsmanship in every piece we create.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gold/10 border border-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gold text-2xl">&#10022;</span>
            </div>
            <h3 className="font-serif text-lg mb-2 text-gold">Sustainability</h3>
            <p className="text-sm text-muted-foreground">
              Ethically sourced materials and eco-friendly practices guide everything we do.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gold/10 border border-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gold text-2xl">&#10022;</span>
            </div>
            <h3 className="font-serif text-lg mb-2 text-gold">Community</h3>
            <p className="text-sm text-muted-foreground">
              Supporting local artisans and giving back to our community.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
