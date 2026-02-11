import type { Article } from '@/types';

export const articles: Article[] = [
  {
    id: '1',
    title: 'How to Choose the Perfect Engagement Ring',
    source: 'LUSTRE LAB JOURNAL',
    date: 'Jan 15, 2025',
    excerpt: 'Discover the essential factors to consider when selecting an engagement ring that will symbolize your love story for a lifetime...',
    image: '/images/hero-ring.jpg',
    href: '#article-1',
  },
  {
    id: '2',
    title: 'The Art of Caring for Your Fine Jewelry',
    source: 'LUSTRE LAB GUIDE',
    date: 'Jan 10, 2025',
    excerpt: 'Learn expert tips on maintaining the brilliance and beauty of your precious jewelry pieces for generations to come...',
    image: '/images/shop-the-look.jpg',
    href: '#article-2',
  },
  {
    id: '3',
    title: 'Understanding Moissanite: The Brilliant Alternative',
    source: 'LUSTRE LAB EDUCATION',
    date: 'Jan 5, 2025',
    excerpt: 'Explore why moissanite has become the preferred choice for conscious consumers seeking beauty and value...',
    image: '/images/hero-necklace.jpg',
    href: '#article-3',
  },
];

export const jewelryCareTips = [
  {
    title: 'Daily Care',
    tips: [
      'Remove jewelry before showering, swimming, or exercising',
      'Apply lotions and perfumes before putting on jewelry',
      'Store pieces separately to prevent scratching',
    ],
  },
  {
    title: 'Cleaning',
    tips: [
      'Clean with mild soap and warm water',
      'Use a soft brush for hard-to-reach areas',
      'Pat dry with a soft, lint-free cloth',
    ],
  },
  {
    title: 'Storage',
    tips: [
      'Store in a cool, dry place',
      'Use individual pouches or compartments',
      'Keep away from direct sunlight',
    ],
  },
];
