/**
 * Represents an item in a shopping cart with embedded product information.
 */
export interface CartItem {
  /** Unique product identifier */
  productId: string;
  /** Product display name */
  productName: string;
  /** Product unit price */
  price: number;
  /** Quantity of items in cart */
  quantity: number;
}

/**
 * Represents a shopping cart with items and computed total.
 */
export interface Cart {
  /** Array of items in the cart */
  items: CartItem[];
  /** Computed total price of all items */
  total: number;
}
