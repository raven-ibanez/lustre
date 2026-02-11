import { useState, useEffect, useCallback } from 'react';
import { heroSlides } from '@/data/products';

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative w-full overflow-hidden" style={{ height: '65vh', minHeight: '500px' }}>
      <div
        className="absolute inset-0 transition-opacity duration-800"
        key={currentSlide}
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroSlides[currentSlide].image})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4 animate-fade-in">
          <p className="text-xs uppercase tracking-[3px] mb-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {heroSlides[currentSlide].title}
          </p>
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl max-w-3xl mb-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            {heroSlides[currentSlide].subtitle}
          </h1>
          <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <a href={heroSlides[currentSlide].href} className="btn-ghost">
              {heroSlides[currentSlide].cta}
            </a>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white w-6' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
