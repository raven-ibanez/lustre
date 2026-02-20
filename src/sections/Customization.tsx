export function Customization() {
  return (
    <section id="custom" className="relative h-[500px] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/images/customization.jpg)' }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl animate-slide-up">
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-6">
              bespoke creations
            </h2>
            <p className="text-white/90 text-sm leading-relaxed mb-8">
              Bring your dream jewelry to life with our custom design service. Our master
              craftsmen work with you to create one-of-a-kind pieces that tell your unique story.
              From engagement rings to anniversary gifts, we transform your vision into reality.
            </p>
            <a href="#quotation" className="btn-ghost">
              Get a Custom Quote
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
