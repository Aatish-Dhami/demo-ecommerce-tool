/**
 * Represents a product in the e-commerce shop.
 * This is the core data structure for product catalog items.
 */
export interface Product {
  /** Unique identifier for the product */
  id: string;

  /** Display name of the product */
  name: string;

  /** Detailed description of the product */
  description: string;

  /** Price in USD */
  price: number;

  /** URL to the product image */
  image: string;

  /** Product category for filtering/grouping */
  category: string;
}
