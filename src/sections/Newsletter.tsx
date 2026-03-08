import { useState } from 'react';

export function Newsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#13204A' }}>
      <div className="max-w-2xl mx-auto text-center">
        <div className="animate-fade-in">
          <h2 className="font-serif text-2xl mb-2" style={{ color: '#EDE7DC' }}>Join the Lustre Lab Family</h2>
          <p className="text-sm mb-8" style={{ color: 'rgba(237,231,220,0.8)' }}>
            Subscribe for exclusive offers, early access to new collections, and jewelry care tips.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 bg-transparent focus:outline-none transition-colors"
              style={{
                borderBottom: '1px solid rgba(237,231,220,0.3)',
                color: '#EDE7DC',
              }}
              required
            />
            <button
              type="submit"
              className="px-8 py-3 text-xs uppercase tracking-[2px] font-semibold transition-colors"
              style={{ border: '1px solid #EDE7DC', color: '#EDE7DC' }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#EDE7DC';
                e.currentTarget.style.color = '#13204A';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#EDE7DC';
              }}
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

