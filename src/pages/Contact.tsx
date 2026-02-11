import { useState } from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div id="contact" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-cream min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="section-title mb-4">Get in Touch</h1>
        <p className="text-center text-muted-foreground mb-12">
          We'd love to hear from you. Reach out for inquiries, custom orders, or just to say hello.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white p-8">
            <h2 className="font-serif text-xl mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-forest focus:outline-none"
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-forest focus:outline-none"
                required
              />
              <input
                type="text"
                placeholder="Subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-forest focus:outline-none"
                required
              />
              <textarea
                placeholder="Your Message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-forest focus:outline-none resize-none"
                rows={5}
                required
              />
              <button type="submit" className="w-full btn-primary">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white p-8">
              <h2 className="font-serif text-xl mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-forest mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Email</p>
                    <a href="mailto:hello@lustrelab.com" className="text-muted-foreground hover:text-forest">
                      hello@lustrelab.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-forest mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Phone</p>
                    <a href="tel:+639123456789" className="text-muted-foreground hover:text-forest">
                      +63 912 345 6789
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-forest mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Address</p>
                    <p className="text-muted-foreground">
                      123 Jewelry Street<br />
                      Makati City, Philippines
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-forest mt-0.5" />
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
            <div className="bg-forest text-white p-8">
              <h2 className="font-serif text-xl mb-4">Custom Orders</h2>
              <p className="text-sm text-white/80 mb-4">
                Looking for something unique? We specialize in custom jewelry design. 
                Share your vision with us and we'll bring it to life.
              </p>
              <a href="#custom" className="inline-block border border-white text-white px-6 py-2 text-xs uppercase tracking-wider hover:bg-white hover:text-forest transition-colors">
                Start a Custom Order
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
