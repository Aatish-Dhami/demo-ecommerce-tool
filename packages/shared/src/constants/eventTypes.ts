/**
 * Enum of all supported tracking event types.
 * Used for type-safe event handling across tracker and backend.
 */
export enum EventType {
  /** User viewed a page */
  PAGE_VIEW = 'page_view',
  /** User viewed a product detail page */
  PRODUCT_VIEWED = 'product_viewed',
  /** User added an item to cart */
  ADD_TO_CART = 'add_to_cart',
  /** User removed an item from cart */
  REMOVE_FROM_CART = 'remove_from_cart',
  /** User started the checkout process */
  CHECKOUT_STARTED = 'checkout_started',
  /** User completed a purchase */
  PURCHASE_COMPLETED = 'purchase_completed',
}
