import { useState } from 'react';
import { Sparkles, MessageSquare, Palette, Package } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function CustomOrder() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    jewelryType: '',
    budget: '',
    timeline: '',
    description: '',
    inspiration: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('bespoke_requests')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          jewelry_type: formData.jewelryType,
          budget: formData.budget,
          timeline: formData.timeline,
          description: formData.description,
          inspiration: formData.inspiration
        }]);

      if (error) throw error;

      alert('Thank you for your custom order request! We will contact you within 24-48 hours to discuss your design.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        jewelryType: '',
        budget: '',
        timeline: '',
        description: '',
        inspiration: '',
      });
    } catch (err) {
      console.error('Bespoke error:', err);
      alert('Failed to submit request. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="custom" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-background min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="section-title mb-4">Bespoke Creations</h1>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Let us bring your dream jewelry to life. Our master craftsmen will work with you
          to create a one-of-a-kind piece that tells your unique story.
        </p>

        {/* Process */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="bg-card p-6 text-center border border-foreground/10 shadow-2xl">
            <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-5 h-5 text-primary-dark" />
            </div>
            <h3 className="font-serif text-lg mb-2 text-gold italic">1. Consultation</h3>
            <p className="text-sm text-muted-foreground">
              Share your vision with us through a detailed consultation
            </p>
          </div>
          <div className="bg-card p-6 text-center border border-foreground/10 shadow-2xl">
            <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <Palette className="w-5 h-5 text-primary-dark" />
            </div>
            <h3 className="font-serif text-lg mb-2 text-gold italic">2. Design</h3>
            <p className="text-sm text-muted-foreground">
              Our designers create sketches and 3D renderings for your approval
            </p>
          </div>
          <div className="bg-card p-6 text-center border border-foreground/10 shadow-2xl">
            <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-5 h-5 text-primary-dark" />
            </div>
            <h3 className="font-serif text-lg mb-2 text-gold italic">3. Crafting</h3>
            <p className="text-sm text-muted-foreground">
              Master artisans handcraft your piece with meticulous attention
            </p>
          </div>
          <div className="bg-card p-6 text-center border border-foreground/10 shadow-2xl">
            <div className="w-12 h-12 bg-gold/10 border border-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-5 h-5 text-gold" />
            </div>
            <h3 className="font-serif text-lg mb-2 text-gold italic">4. Delivery</h3>
            <p className="text-sm text-muted-foreground">
              Your finished piece is carefully packaged and delivered to you
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-card p-8 border border-foreground/10 shadow-2xl">
            <h2 className="font-serif text-xl mb-6 text-gold italic">Start Your Custom Order</h2>
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
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-gold focus:outline-none"
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-gold focus:outline-none"
                required
              />

              <select
                value={formData.jewelryType}
                onChange={(e) => setFormData({ ...formData, jewelryType: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-gold focus:outline-none"
                required
              >
                <option value="">Select Jewelry Type</option>
                <option value="ring">Ring</option>
                <option value="necklace">Necklace</option>
                <option value="earrings">Earrings</option>
                <option value="bracelet">Bracelet</option>
                <option value="other">Other</option>
              </select>

              <select
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-gold focus:outline-none"
                required
              >
                <option value="">Select Budget Range</option>
                <option value="below-10k">Below ₱10,000</option>
                <option value="10k-25k">₱10,000 - ₱25,000</option>
                <option value="25k-50k">₱25,000 - ₱50,000</option>
                <option value="50k-100k">₱50,000 - ₱100,000</option>
                <option value="above-100k">Above ₱100,000</option>
              </select>

              <select
                value={formData.timeline}
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-gold focus:outline-none"
                required
              >
                <option value="">Select Timeline</option>
                <option value="2-4-weeks">2-4 weeks</option>
                <option value="1-2-months">1-2 months</option>
                <option value="2-3-months">2-3 months</option>
                <option value="flexible">Flexible</option>
              </select>

              <textarea
                placeholder="Describe your dream piece..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-gold focus:outline-none resize-none"
                rows={4}
                required
              />

              <textarea
                placeholder="Share any inspiration (links, images, ideas)..."
                value={formData.inspiration}
                onChange={(e) => setFormData({ ...formData, inspiration: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-gold focus:outline-none resize-none"
                rows={3}
              />

              <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50">
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div className="p-8 border border-foreground/10" style={{ backgroundColor: '#13204A', color: '#EDE7DC' }}>
              <h2 className="font-serif text-xl mb-4">Why Choose Custom?</h2>
              <ul className="space-y-3 text-sm" style={{ color: 'rgba(237,231,220,0.8)' }}>
                <li className="flex items-start gap-2">
                  <span>&#10022;</span>
                  <span>Create a truly one-of-a-kind piece</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>&#10022;</span>
                  <span>Work directly with our master craftsmen</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>&#10022;</span>
                  <span>Choose your preferred materials and gemstones</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>&#10022;</span>
                  <span>Perfect for engagement rings and special occasions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>&#10022;</span>
                  <span>Lifetime care and maintenance included</span>
                </li>
              </ul>
            </div>

            <div className="bg-card p-8 border border-foreground/10 shadow-2xl">
              <h2 className="font-serif text-xl mb-4 text-gold italic">Questions?</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Not sure where to start? Our team is here to guide you through
                the custom design process.
              </p>
              <a href="#contact" className="btn-secondary px-8">
                Schedule a Consultation
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
