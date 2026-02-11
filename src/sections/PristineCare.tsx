export function PristineCare() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-cream">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="animate-slide-right">
            <h2 className="section-title text-left mb-6">Our Promise</h2>
            <p className="text-sm leading-relaxed text-foreground mb-6">
              At Lustre Lab, we believe that beautiful jewelry shouldn't come at the cost of 
              our planet. That's why we're committed to ethical sourcing, sustainable practices, 
              and creating pieces that last a lifetime.
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2 text-sm">
                <span className="text-gold">&#10022;</span>
                <span>Ethically sourced gemstones and materials</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-gold">&#10022;</span>
                <span>Recycled gold and eco-friendly packaging</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-gold">&#10022;</span>
                <span>Fair wages for our artisans</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-gold">&#10022;</span>
                <span>Lifetime repair and maintenance service</span>
              </li>
            </ul>
            <a href="#about" className="btn-primary inline-flex items-center gap-2">
              Learn more about us
            </a>
          </div>

          {/* Image */}
          <div className="grid grid-cols-2 gap-4 animate-slide-left">
            <img
              src="/images/packaging.jpg"
              alt="Lustre Lab Packaging"
              className="w-full h-64 object-cover"
            />
            <img
              src="/images/gift-voucher.jpg"
              alt="Lustre Lab Gift Box"
              className="w-full h-64 object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
