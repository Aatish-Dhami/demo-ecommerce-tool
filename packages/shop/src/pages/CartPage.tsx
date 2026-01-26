import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import './CartPage.css';

export function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (cart.items.length === 0) {
    return (
      <div className="cart-page">
        <h1 className="cart-page__title">Shopping Cart</h1>
        <div className="cart-page__empty">
          <p>Your cart is empty.</p>
          <Link to="/" className="cart-page__continue-link">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="cart-page__title">Shopping Cart</h1>

      <div className="cart-page__items">
        {cart.items.map((item) => (
          <div key={item.productId} className="cart-page__item">
            <div className="cart-page__item-info">
              <h3 className="cart-page__item-name">{item.productName}</h3>
              <p className="cart-page__item-price">{formatPrice(item.price)} x {item.quantity}</p>
            </div>
            <div className="cart-page__item-actions">
              <span className="cart-page__item-total">
                {formatPrice(item.price * item.quantity)}
              </span>
              <button
                className="cart-page__remove-button"
                onClick={() => removeFromCart(item.productId)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-page__summary">
        <div className="cart-page__total">
          <span>Total:</span>
          <span className="cart-page__total-amount">{formatPrice(cart.total)}</span>
        </div>
        <div className="cart-page__actions">
          <button className="cart-page__clear-button" onClick={clearCart}>
            Clear Cart
          </button>
          <Link to="/checkout" className="cart-page__checkout-button">
            Proceed to Checkout
          </Link>
        </div>
      </div>

      <Link to="/" className="cart-page__continue-link">
        &larr; Continue Shopping
      </Link>
    </div>
  );
}
