import { jewelryCareTips } from '@/data/articles';

export function JewelryCare() {
  return (
    <div id="jewelry-care" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-cream min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="section-title mb-4">Jewelry Care Guide</h1>
        <p className="text-center text-muted-foreground mb-12">
          Keep your Lustre Lab pieces looking beautiful for years to come
        </p>

        {/* Care Tips */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {jewelryCareTips.map((section, index) => (
            <div key={section.title} className="bg-white p-6 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <h2 className="font-serif text-lg mb-4">{section.title}</h2>
              <ul className="space-y-2">
                {section.tips.map((tip, tipIndex) => (
                  <li key={tipIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-gold">&#10022;</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Cleaning Guide */}
        <div className="bg-white p-8 mb-8">
          <h2 className="font-serif text-xl mb-6">How to Clean Your Jewelry</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-medium mb-3">Regular Cleaning (Weekly)</h3>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li>1. Mix warm water with a few drops of mild dish soap</li>
                <li>2. Soak your jewelry for 10-15 minutes</li>
                <li>3. Gently brush with a soft toothbrush</li>
                <li>4. Rinse thoroughly with clean water</li>
                <li>5. Pat dry with a soft, lint-free cloth</li>
              </ol>
            </div>
            <div>
              <h3 className="font-medium mb-3">Deep Cleaning (Monthly)</h3>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li>1. Use a jewelry cleaning solution suitable for your metal</li>
                <li>2. Follow the product instructions carefully</li>
                <li>3. For gemstones, consult a professional jeweler</li>
                <li>4. Never use harsh chemicals or abrasives</li>
                <li>5. Store properly after cleaning</li>
              </ol>
            </div>
          </div>
        </div>

        {/* What to Avoid */}
        <div className="bg-forest text-white p-8">
          <h2 className="font-serif text-xl mb-4">What to Avoid</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-white/80">
            <ul className="space-y-2">
              <li>&#10022; Harsh chemicals (bleach, chlorine, ammonia)</li>
              <li>&#10022; Abrasive materials or rough cloths</li>
              <li>&#10022; Ultrasonic cleaners for soft gemstones</li>
            </ul>
            <ul className="space-y-2">
              <li>&#10022; Wearing jewelry during strenuous activities</li>
              <li>&#10022; Exposing to extreme temperatures</li>
              <li>&#10022; Storing multiple pieces together</li>
            </ul>
          </div>
        </div>

        {/* Professional Service */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Need professional cleaning or repair? We offer complimentary cleaning services 
            for all Lustre Lab pieces.
          </p>
          <a href="#contact" className="btn-secondary">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
