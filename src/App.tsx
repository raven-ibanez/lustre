import { useState, useEffect } from 'react';
import { CartProvider } from '@/context/CartContext';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { EmailPopup } from '@/components/EmailPopup';
import { CartDrawer } from '@/components/CartDrawer';
import { Hero } from '@/sections/Hero';
import { ProductNotice } from '@/sections/ProductNotice';
import { FeaturedProduct } from '@/sections/FeaturedProduct';
import { ValentinesPicks } from '@/sections/ValentinesPicks';
import { GiftVoucher } from '@/sections/GiftVoucher';
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

type Page = 'home' | 'shop' | 'ring-size-guide' | 'jewelry-care' | 'about' | 'contact' | 'shipping' | 'terms' | 'faqs' | 'custom';

function HomePage() {
  return (
    <>
      <Hero />
      <ProductNotice />
      <FeaturedProduct />
      <ValentinesPicks />
      <GiftVoucher />
      <Customization />
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

  // Handle hash-based navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
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
      };
      setCurrentPage(pageMap[hash] || 'home');
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'shop':
        return <Shop />;
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
      default:
        return <HomePage />;
    }
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-cream">
        <AnnouncementBar />
        <Header />
        <main>
          {renderPage()}
        </main>
        <Footer />
        <EmailPopup />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}

export default App;
