import { Product } from '../types/product';

/**
 * Mock product data for the demo e-commerce shop.
 */
export const products: Product[] = [
  {
    id: 'prod-001',
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium over-ear headphones with active noise cancellation and 30-hour battery life.',
    price: 149.99,
    image: 'https://picsum.photos/seed/headphones/400/400',
    category: 'Electronics',
  },
  {
    id: 'prod-002',
    name: 'USB-C Fast Charger',
    description: 'Compact 65W GaN charger compatible with laptops, tablets, and smartphones.',
    price: 39.99,
    image: 'https://picsum.photos/seed/charger/400/400',
    category: 'Electronics',
  },
  {
    id: 'prod-003',
    name: 'Classic Cotton T-Shirt',
    description: 'Soft, breathable 100% cotton t-shirt. Available in multiple colors.',
    price: 24.99,
    image: 'https://picsum.photos/seed/tshirt/400/400',
    category: 'Clothing',
  },
  {
    id: 'prod-004',
    name: 'Running Sneakers',
    description: 'Lightweight athletic shoes with responsive cushioning for everyday running.',
    price: 89.99,
    image: 'https://picsum.photos/seed/sneakers/400/400',
    category: 'Clothing',
  },
  {
    id: 'prod-005',
    name: 'Ceramic Coffee Mug',
    description: 'Handcrafted 12oz ceramic mug. Microwave and dishwasher safe.',
    price: 14.99,
    image: 'https://picsum.photos/seed/mug/400/400',
    category: 'Home & Kitchen',
  },
  {
    id: 'prod-006',
    name: 'LED Desk Lamp',
    description: 'Adjustable desk lamp with touch dimmer and USB charging port.',
    price: 34.99,
    image: 'https://picsum.photos/seed/lamp/400/400',
    category: 'Home & Kitchen',
  },
  {
    id: 'prod-007',
    name: 'TypeScript Programming Guide',
    description: 'Comprehensive guide to TypeScript for modern web development.',
    price: 44.99,
    image: 'https://picsum.photos/seed/book/400/400',
    category: 'Books',
  },
  {
    id: 'prod-008',
    name: 'Wireless Mechanical Keyboard',
    description: 'Compact 75% layout mechanical keyboard with hot-swappable switches.',
    price: 119.99,
    image: 'https://picsum.photos/seed/keyboard/400/400',
    category: 'Electronics',
  },
];
