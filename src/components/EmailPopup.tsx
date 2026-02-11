import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export function EmailPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', formData);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 animate-fade-in"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="relative bg-secondary max-w-4xl w-full overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 z-10 text-forest hover:text-primary-dark transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Image */}
          <div className="hidden md:block">
            <img
              src="/images/product-ring-1.jpg"
              alt="Lustre Lab Jewelry"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Form */}
          <div className="p-8 md:p-12">
            <div className="text-center mb-8">
              <img
                src="/images/logo-mark.png"
                alt="Lustre Lab"
                className="h-16 mx-auto mb-6"
              />
              <h2 className="text-2xl font-serif mb-2">
                JOIN THE LUSTRE LAB FAMILY
              </h2>
              <p className="text-sm text-muted-foreground">
                Subscribe to receive exclusive offers, early access to new collections, and jewelry care tips.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="First name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-3 bg-white border-0 text-sm focus:ring-2 focus:ring-forest"
                required
              />
              <input
                type="text"
                placeholder="Last name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-3 bg-white border-0 text-sm focus:ring-2 focus:ring-forest"
                required
              />
              <input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white border-0 text-sm focus:ring-2 focus:ring-forest"
                required
              />
              <button
                type="submit"
                className="w-full btn-primary py-4"
              >
                SUBSCRIBE NOW
              </button>
            </form>

            <p className="mt-6 text-xs text-center text-muted-foreground">
              By subscribing, you agree to receive marketing emails from Lustre Lab.<br />
              You can unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
