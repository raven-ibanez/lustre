import { } from 'lucide-react';

export function VideoFeature() {

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center text-white mb-8 animate-fade-in">
          <p className="text-xs uppercase tracking-wider mb-2">behind the scenes</p>
          <h2 className="font-serif text-2xl md:text-3xl mb-4">
            The Art of Craftsmanship
          </h2>
          <p className="text-white/80 text-sm leading-relaxed max-w-2xl mx-auto">
            Discover the meticulous process behind every Lustre Lab piece. From sketch to finished
            jewelry, our master craftsmen pour their passion and expertise into creating
            timeless treasures.
          </p>
        </div>

        <div className="relative aspect-video overflow-hidden animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <img
            src="/images/customization.jpg"
            alt="Lustre Lab Craftsmanship"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="text-center mt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <p className="text-white/80 text-sm">
            Every piece is handcrafted with love and precision in our Manila atelier.
          </p>
        </div>
      </div>
    </section>
  );
}
