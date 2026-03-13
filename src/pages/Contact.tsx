import { useState } from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('contact_inquiries')
        .insert([formData]);

      if (error) throw error;

      alert('Thank you for your message! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Contact error:', err);
      alert('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="contact" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-background min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="section-title mb-4">Get in Touch</h1>
        <p className="text-center text-muted-foreground mb-12">
          We'd love to hear from you. Reach out for inquiries, custom orders, or just to say hello.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white p-5 sm:p-8">
            <h2 className="font-serif text-xl mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-gold focus:outline-none"
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-gold focus:outline-none"
                required
              />
              <input
                type="text"
                placeholder="Subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-gold focus:outline-none"
                required
              />
              <textarea
                placeholder="Your Message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-gold focus:outline-none resize-none"
                rows={5}
                required
              />
              <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50">
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white p-5 sm:p-8">
              <h2 className="font-serif text-xl mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-gold mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Email</p>
                    <a href="mailto:hello@lustrelab.com" className="text-muted-foreground hover:text-gold">
                      hello@lustrelab.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-gold mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Phone</p>
                    <a href="tel:+639123456789" className="text-muted-foreground hover:text-gold">
                      +63 912 345 6789
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-gold mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Address</p>
                    <p className="text-muted-foreground">
                      123 Jewelry Street<br />
                      Makati City, Philippines
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-gold mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Business Hours</p>
                    <p className="text-muted-foreground">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Orders */}
            <div className="border border-gold/20 p-5 sm:p-8" style={{ backgroundColor: '#13204A' }}>
              <h2 className="font-serif text-xl mb-4" style={{ color: '#EDE7DC' }}>Custom Orders</h2>
              <p className="text-sm mb-4" style={{ color: 'rgba(237,231,220,0.8)' }}>
                Looking for something unique? We specialize in custom jewelry design.
                Share your vision with us and we'll bring it to life.
              </p>
              <a href="#custom" className="inline-block px-6 py-2 text-xs uppercase tracking-wider transition-colors" style={{ border: '1px solid #EDE7DC', color: '#EDE7DC' }}
                onMouseEnter={undefined}
              >
                Start a Custom Order
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
