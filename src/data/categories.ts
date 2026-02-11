import type { Category } from '@/types';

export const categories: Category[] = [
  {
    id: '1',
    name: 'Rings',
    image: '/images/product-ring-1.jpg',
    href: '#rings',
  },
  {
    id: '2',
    name: 'Earrings',
    image: '/images/product-earrings-1.jpg',
    href: '#earrings',
  },
  {
    id: '3',
    name: 'Bracelets',
    image: '/images/product-bracelet-1.jpg',
    href: '#bracelets',
  },
  {
    id: '4',
    name: 'Necklaces',
    image: '/images/product-necklace-1.jpg',
    href: '#necklaces',
  },
];

export const ringTypes = [
  { name: 'Promise Rings', description: 'Symbolize your commitment with our elegant promise rings.' },
  { name: 'Eternity Rings', description: 'Continuous circle of stones representing everlasting love.' },
  { name: 'Engagement Rings', description: 'Start your forever with our stunning engagement collection.' },
  { name: 'Wedding Bands', description: 'Timeless bands to seal your union.' },
  { name: 'Stackable Rings', description: 'Mix and match to create your unique style.' },
];

export const ringSizeGuide = [
  { size: 4, diameter: 14.9, circumference: 46.8 },
  { size: 5, diameter: 15.7, circumference: 49.3 },
  { size: 6, diameter: 16.5, circumference: 51.8 },
  { size: 7, diameter: 17.3, circumference: 54.4 },
  { size: 8, diameter: 18.1, circumference: 56.9 },
  { size: 9, diameter: 18.9, circumference: 59.4 },
  { size: 10, diameter: 19.7, circumference: 61.9 },
  { size: 11, diameter: 20.5, circumference: 64.4 },
  { size: 12, diameter: 21.3, circumference: 66.9 },
];
