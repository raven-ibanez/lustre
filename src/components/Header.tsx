import { useState, useRef, useEffect, useMemo } from 'react';
import { ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useSupabase } from '@/hooks/useSupabase';
import type { Category } from '@/types';

interface HeaderProps {
  isTransparent?: boolean;
}

export function Header({ isTransparent = false }: HeaderProps) {
  const { totalItems, setIsCartOpen } = useCart();
  const { getCategories } = useSupabase();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const navItems = useMemo(() => {
    const items = [
      { name: 'Home', href: '#home' },
      {
        name: 'Shop',
        href: '#shop',
        dropdown: [
          { name: 'All Products', href: '#shop' },
        ]
      },
    ];

    // Add dynamic categories
    categories.forEach(cat => {
      items.push({
        name: cat.name,
        href: `#shop/${cat.id}`,
        // @ts-ignore - keeping it simple for now as per user request to have categories as top level
      });
    });

    items.push({
      name: 'Guide',
      href: '#guide',
      dropdown: [
        { name: 'Ring Size Guide', href: '#ring-size-guide' },
        { name: 'Jewelry Care', href: '#jewelry-care' },
        { name: 'About Us', href: '#about' },
        { name: 'Contact', href: '#contact' },
        { name: 'Admin Dashboard', href: '#admin' },
      ]
    });

    return items;
  }, [categories]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [navIsStuck, setNavIsStuck] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = (itemName: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setActiveDropdown(itemName);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const handleDropdownMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
  };

  const handleDropdownMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  // Detect when the nav bar becomes stuck at the top
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the nav's top sentinel goes out of view, the nav is stuck
        setNavIsStuck(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '-1px 0px 0px 0px' }
    );

    // Create a sentinel element right before the nav
    const sentinel = document.createElement('div');
    sentinel.style.height = '1px';
    sentinel.style.width = '100%';
    sentinel.style.position = 'absolute';
    sentinel.style.top = '-1px';
    nav.style.position = 'relative';
    nav.prepend(sentinel);
    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      sentinel.remove();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Full header wrapper */}
      <div
        className="header-wrapper"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: isTransparent ? 'absolute' : 'relative',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
        }}
      >
        {/* Logo Section */}
        <div
          className="transition-colors duration-300"
          style={{
            backgroundColor: isHovered || !isTransparent ? '#050b18' : 'transparent',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-center py-5">
              {/* Mobile hamburger - left */}
              <button
                className="lg:hidden absolute left-0 text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              {/* Centered Logo */}
              <a href="#home" className="flex-shrink-0">
                <img
                  src="/images/image.png"
                  alt="Lustre Lab"
                  className="h-16 lg:h-20"
                />
              </a>

              {/* Right Icons */}
              <div className="absolute right-0 flex items-center space-x-4">
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative text-white hover:text-white/80 transition-colors"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-gold text-primary-dark text-xs font-bold rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Bar - sticky, transparent by default, bg on hover or when stuck */}
        <nav
          ref={navRef}
          className="transition-colors duration-300"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            backgroundColor: isHovered || navIsStuck || !isTransparent ? '#050b18' : 'transparent',
            borderTop: isHovered || navIsStuck || !isTransparent ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
            boxShadow: navIsStuck ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="hidden lg:flex items-center justify-center gap-8 py-3">
              {navItems.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.dropdown && handleMouseEnter(item.name)}
                  onMouseLeave={handleMouseLeave}
                >
                  <a
                    href={item.href}
                    className="nav-link text-white flex items-center gap-1 py-2"
                  >
                    {item.name}
                    {item.dropdown && <ChevronDown className="w-3 h-3" />}
                  </a>

                  {/* Dropdown */}
                  {item.dropdown && activeDropdown === item.name && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-56 bg-background shadow-xl py-2 animate-fade-in"
                      onMouseEnter={handleDropdownMouseEnter}
                      onMouseLeave={handleDropdownMouseLeave}
                    >
                      {item.dropdown.map((subItem) => (
                        <a
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          {subItem.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background pt-32 animate-slide-up">
          <nav className="flex flex-col items-center space-y-6 py-8">
            {navItems.map((item) => (
              <div key={item.name} className="text-center">
                <a
                  href={item.href}
                  className="text-white text-lg uppercase tracking-wider block mb-2"
                  onClick={() => !item.dropdown && setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
                {item.dropdown && (
                  <div className="space-y-2 mt-2">
                    {item.dropdown.map((subItem) => (
                      <a
                        key={subItem.name}
                        href={subItem.href}
                        className="block text-white/70 text-sm"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {subItem.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
