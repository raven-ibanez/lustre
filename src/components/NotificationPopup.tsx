import { useState, useEffect } from 'react';
import { X, Mail, Sparkles } from 'lucide-react';

export function NotificationPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000); // Show after 5 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Here you would typically send the email to your backend/service
      console.log('Subscribing email:', email);
      setIsSubscribed(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-500">
      <div className="relative bg-white w-full max-w-2xl overflow-hidden rounded-3xl shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-500">
        {/* Left Side: Image */}
        <div className="md:w-1/2 h-48 md:h-auto relative">
          <img 
            src="/images/newsletter_popup.png" 
            alt="Join Lustre Club" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r md:from-transparent md:to-white/10" />
        </div>

        {/* Right Side: Content */}
        <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center bg-white relative">
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>

          {!isSubscribed ? (
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                Exclusive Access
              </div>
              
              <div>
                <h3 className="text-2xl font-serif text-slate-900 mb-2">Join the Lustre Club</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Be the first to know about new arrivals, private sales, and jewelry care tips.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-3 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all"
                >
                  Join Now
                </button>
              </form>
              
              <p className="text-[10px] text-slate-400 text-center uppercase tracking-tighter">
                By joining, you agree to our terms & privacy policy.
              </p>
            </div>
          ) : (
            <div className="text-center space-y-4 py-10 animate-in fade-in zoom-in duration-500">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif text-slate-900">Welcome to the Club</h3>
              <p className="text-slate-500 text-sm">
                Thank you for subscribing! Check your email for a special welcome gift.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
