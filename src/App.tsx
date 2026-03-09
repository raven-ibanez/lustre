import { useState, useEffect } from 'react';
import { CartProvider } from '@/context/CartContext';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { NotificationPopup } from '@/components/NotificationPopup';

import { CartDrawer } from '@/components/CartDrawer';
import { Hero } from '@/sections/Hero';
import { ProductNotice } from '@/sections/ProductNotice';
import { FeaturedProduct } from '@/sections/FeaturedProduct';
import { ValentinesPicks } from '@/sections/ValentinesPicks';
import { Customization } from '@/sections/Customization';
import { FeaturedCollection } from '@/sections/FeaturedCollection';
import { ShopByCategory } from '@/sections/ShopByCategory';
import { BestSellers } from '@/sections/BestSellers';
import { ShopTheLook } from '@/sections/ShopTheLook';
import { FeaturedOn } from '@/sections/FeaturedOn';
import { VideoFeature } from '@/sections/VideoFeature';
import { PristineCare } from '@/sections/PristineCare';
import { Newsletter } from '@/sections/Newsletter';
import { RingSizeGuide } from '@/pages/RingSizeGuide';
import { JewelryCare } from '@/pages/JewelryCare';
import { About } from '@/pages/About';
import { Contact } from '@/pages/Contact';
import { Shop } from '@/pages/Shop';
import { Shipping } from '@/pages/Shipping';
import { Terms } from '@/pages/Terms';
import { FAQs } from '@/pages/FAQs';
import { CustomOrder } from '@/pages/CustomOrder';
import { CustomRingQuotation } from '@/pages/CustomRingQuotation';
import { Admin } from '@/pages/Admin';

type Page = 'home' | 'shop' | 'ring-size-guide' | 'jewelry-care' | 'about' | 'contact' | 'shipping' | 'terms' | 'faqs' | 'custom' | 'quotation' | 'admin';

function HomePage() {
  return (
    <>
      <Hero />
      <ProductNotice />
      <Customization />
      <FeaturedProduct />
      <ValentinesPicks />
      <FeaturedCollection />
      <ShopByCategory />
      <BestSellers />
      <ShopTheLook />
      <FeaturedOn />
      <VideoFeature />
      <PristineCare />
      <Newsletter />
    </>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  // Handle hash-based navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const [baseHash, subHash] = hash.split('/');

      const pageMap: Record<string, Page> = {
        'home': 'home',
        'shop': 'shop',
        'all-products': 'shop',
        'ring-size-guide': 'ring-size-guide',
        'jewelry-care': 'jewelry-care',
        'about': 'about',
        'contact': 'contact',
        'shipping': 'shipping',
        'terms': 'terms',
        'faqs': 'faqs',
        'custom': 'custom',
        'quotation': 'quotation',
        'admin': 'admin',
      };

      const targetPage = pageMap[baseHash] || 'home';
      setCurrentPage(targetPage);

      if (baseHash === 'shop' && subHash) {
        setCategoryFilter(subHash);
      } else {
        setCategoryFilter(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'shop':
        return <Shop initialCategory={categoryFilter} />;
      case 'ring-size-guide':
        return <RingSizeGuide />;
      case 'jewelry-care':
        return <JewelryCare />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'shipping':
        return <Shipping />;
      case 'terms':
        return <Terms />;
      case 'faqs':
        return <FAQs />;
      case 'custom':
        return <CustomOrder />;
      case 'quotation':
        return <CustomRingQuotation />;
      case 'admin':
        return <Admin />;
      default:
        return <HomePage />;
    }
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <AnnouncementBar />
        <Header isTransparent={currentPage === 'home'} />
        <main>
          {renderPage()}
        </main>
        <Footer />
        <NotificationPopup />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}

export default App;
