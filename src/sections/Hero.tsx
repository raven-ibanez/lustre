import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { HeroSlide } from '../types';

export function Hero() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchSlides = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      if (data && data.length > 0) {
        setSlides(data);
      }
    } catch (err) {
      console.error('Error fetching hero slides:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  const nextSlide = useCallback(() => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, slides.length]);

  if (loading) {
    return (
      <section className="relative w-full overflow-hidden bg-slate-900 animate-pulse" style={{ height: '65vh', minHeight: '380px' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  if (slides.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden" style={{ height: '65vh', minHeight: '380px' }}>
      <div
        className="absolute inset-0 transition-opacity duration-800"
        key={currentSlide}
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{ backgroundImage: `url(${slides[currentSlide].image_url})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4 animate-fade-in">
          <p className="text-xs uppercase tracking-[3px] mb-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {slides[currentSlide].subtitle}
          </p>
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl max-w-3xl mb-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            {slides[currentSlide].title}
          </h1>
          {slides[currentSlide].cta_text && (
            <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <a href={slides[currentSlide].cta_link || '#'} className="btn-ghost">
                {slides[currentSlide].cta_text}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white w-6' : 'bg-white/50'
                }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
