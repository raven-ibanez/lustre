import { useState } from 'react';

export function Newsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-2xl mx-auto text-center">
        <div className="animate-fade-in">
          <h2 className="font-serif text-2xl text-white mb-2">Join the Lustre Lab Family</h2>
          <p className="text-white/80 text-sm mb-8">
            Subscribe for exclusive offers, early access to new collections, and jewelry care tips.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 bg-transparent border-b border-white/30 text-white placeholder:text-white/50 focus:outline-none focus:border-white transition-colors"
              required
            />
            <button
              type="submit"
              className="px-8 py-3 text-white text-xs uppercase tracking-[2px] font-semibold border border-white hover:bg-white hover:text-primary-dark transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
