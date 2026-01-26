import { products } from '@flowtel/shared';
import { useCart } from '../../hooks/useCart';
import './Checkout.css';

interface CheckoutProps {
  onPurchaseComplete?: () => void;
  onBackToCart?: () => void;
}

export function Checkout({ onPurchaseComplete, onBackToCart }: CheckoutProps) {
  const { cart, clearCart } = useCart();

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getProductImage = (productId: string): string => {
    const product = products.find((p) => p.id === productId);
    return product?.image || '';
  };

  const handleCompletePurchase = () => {
    clearCart();
    if (onPurchaseComplete) {
      onPurchaseComplete();
    }
  };

  const handleBackToCart = () => {
    if (onBackToCart) {
      onBackToCart();
    }
  };

  const isEmpty = cart.items.length === 0;

  if (isEmpty) {
    return (
      <div className="checkout">
        <div className="checkout__header">
          <h1 className="checkout__title">Checkout</h1>
        </div>
        <div className="checkout__empty">
          <p className="checkout__empty-message">Your cart is empty</p>
          {onBackToCart && (
            <button
              className="checkout__back-button"
              onClick={handleBackToCart}
              type="button"
            >
              Back to Cart
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="checkout">
      <div className="checkout__header">
        <h1 className="checkout__title">Checkout</h1>
      </div>

      <div className="checkout__content">
        <div className="checkout__form-section">
          <h2 className="checkout__section-title">Contact Information</h2>
          <form className="checkout__form">
            <div className="checkout__field">
              <label className="checkout__label" htmlFor="name">
                Full Name
              </label>
              <input
                className="checkout__input"
                type="text"
                id="name"
                name="name"
                placeholder="John Doe"
              />
            </div>
            <div className="checkout__field">
              <label className="checkout__label" htmlFor="email">
                Email Address
              </label>
              <input
                className="checkout__input"
                type="email"
                id="email"
                name="email"
                placeholder="john@example.com"
              />
            </div>
          </form>
        </div>

        <div className="checkout__summary-section">
          <h2 className="checkout__section-title">Order Summary</h2>
          <div className="checkout__items">
            {cart.items.map((item) => (
              <div key={item.productId} className="checkout__item">
                <img
                  className="checkout__item-image"
                  src={getProductImage(item.productId)}
                  alt={item.productName}
                />
                <div className="checkout__item-details">
                  <span className="checkout__item-name">{item.productName}</span>
                  <span className="checkout__item-quantity">Qty: {item.quantity}</span>
                </div>
                <span className="checkout__item-price">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="checkout__totals">
            <div className="checkout__totals-row">
              <span className="checkout__totals-label">Subtotal</span>
              <span className="checkout__totals-value">{formatPrice(cart.total)}</span>
            </div>
            <div className="checkout__totals-row checkout__totals-row--total">
              <span className="checkout__totals-label">Total</span>
              <span className="checkout__totals-value">{formatPrice(cart.total)}</span>
            </div>
          </div>

          <button
            className="checkout__complete-button"
            onClick={handleCompletePurchase}
            type="button"
          >
            Complete Purchase
          </button>

          {onBackToCart && (
            <button
              className="checkout__back-link"
              onClick={handleBackToCart}
              type="button"
            >
              Back to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
