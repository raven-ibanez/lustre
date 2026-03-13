import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const { error } = await supabase
        .from('newsletter_signups')
        .insert([{ email }]);

      if (error) {
        if (error.code === '23505') {
          // Unique violation - already subscribed
          setStatus('success');
        } else {
          throw error;
        }
      } else {
        setStatus('success');
      }
      setEmail('');
    } catch (err) {
      console.error('Newsletter error:', err);
      setStatus('error');
    }
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
              disabled={status === 'loading'}
              className="flex-1 px-4 py-3 bg-transparent focus:outline-none transition-colors disabled:opacity-50"
              style={{
                borderBottom: '1px solid rgba(237,231,220,0.3)',
                color: '#EDE7DC',
              }}
              required
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-8 py-3 text-xs uppercase tracking-[2px] font-semibold transition-colors disabled:opacity-50"
              style={{ border: '1px solid #EDE7DC', color: '#EDE7DC' }}
              onMouseEnter={e => {
                if (status !== 'loading') {
                  e.currentTarget.style.backgroundColor = '#EDE7DC';
                  e.currentTarget.style.color = '#13204A';
                }
              }}
              onMouseLeave={e => {
                if (status !== 'loading') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#EDE7DC';
                }
              }}
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          {status === 'success' && (
            <p className="mt-4 text-xs text-emerald-400 animate-fade-in font-medium">Thank you for joining our family!</p>
          )}
          {status === 'error' && (
            <p className="mt-4 text-xs text-red-400 animate-fade-in font-medium">Something went wrong. Please try again.</p>
          )}
        </div>
      </div>
    </section>
  );
}

