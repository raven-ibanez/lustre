import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const customerCareLinks = [
  { name: 'Ring Size Guide', href: '#ring-size-guide' },
  { name: 'Jewelry Care', href: '#jewelry-care' },
  { name: 'Shipping & Returns', href: '#shipping' },
  { name: 'FAQs', href: '#faqs' },
];

const companyLinks = [
  { name: 'About Us', href: '#about' },
  { name: 'Contact Us', href: '#contact' },
  { name: 'Custom Orders', href: '#custom' },
  { name: 'Terms & Conditions', href: '#terms' },
];

export function Footer() {
  return (
    <footer className="bg-forest text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="animate-fade-in">
            <img
              src="/images/logo.png"
              alt="Lustre Lab"
              className="h-16 w-auto mb-6"
            />
            <p className="text-sm text-white/70 mb-4">
              Fine jewelry crafted with passion. Each piece tells a story of elegance and timeless beauty.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Customer Care */}
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-xs uppercase tracking-[2px] mb-6">Customer Care</h3>
            <ul className="space-y-3">
              {customerCareLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-xs uppercase tracking-[2px] mb-6">Lustre Lab</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-xs uppercase tracking-[2px] mb-6">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-white/70">
                <Mail className="w-4 h-4" />
                <a href="mailto:hello@lustrelab.com" className="hover:text-white transition-colors">
                  hello@lustrelab.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/70">
                <Phone className="w-4 h-4" />
                <a href="tel:+639123456789" className="hover:text-white transition-colors">
                  +63 912 345 6789
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-white/70">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>Makati City, Philippines</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-white/10 text-center">
          <p className="text-xs text-white/50">
            &copy; {new Date().getFullYear()} Lustre Lab. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
