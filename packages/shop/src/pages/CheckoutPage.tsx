import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { track, EventType } from '../lib/tracker';
import './CheckoutPage.css';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const hasTrackedCheckout = useRef(false);

  useEffect(() => {
    if (cart.items.length > 0 && !hasTrackedCheckout.current) {
      track(EventType.CHECKOUT_STARTED, {
        cartTotal: cart.total,
        itemCount: cart.items.length,
        items: cart.items.map((item) => ({
          productId: item.productId,
          name: item.productName,
          quantity: item.quantity,
          price: item.price,
        })),
      });
      hasTrackedCheckout.current = true;
    }
  }, [cart.items, cart.total]);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handlePlaceOrder = () => {
    const orderId = `ord-${Date.now()}`;

    track(EventType.PURCHASE_COMPLETED, {
      orderId,
      total: cart.total,
      itemCount: cart.items.length,
      items: cart.items.map((item) => ({
        productId: item.productId,
        name: item.productName,
        quantity: item.quantity,
        price: item.price,
      })),
    });

    clearCart();
    navigate('/confirmation');
  };

  if (cart.items.length === 0) {
    return (
      <div className="checkout-page">
        <h1 className="checkout-page__title">Checkout</h1>
        <div className="checkout-page__empty">
          <p>Your cart is empty. Add some items before checking out.</p>
          <Link to="/" className="checkout-page__link">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1 className="checkout-page__title">Checkout</h1>

      <div className="checkout-page__content">
        <div className="checkout-page__order-summary">
          <h2>Order Summary</h2>
          <div className="checkout-page__items">
            {cart.items.map((item) => (
              <div key={item.productId} className="checkout-page__item">
                <span className="checkout-page__item-name">
                  {item.productName} x {item.quantity}
                </span>
                <span className="checkout-page__item-price">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="checkout-page__total">
            <span>Total:</span>
            <span className="checkout-page__total-amount">{formatPrice(cart.total)}</span>
          </div>
        </div>

        <div className="checkout-page__notice">
          <p>This is a demo shop. No real payment will be processed.</p>
        </div>

        <div className="checkout-page__actions">
          <Link to="/cart" className="checkout-page__back-link">
            &larr; Back to Cart
          </Link>
          <button
            className="checkout-page__place-order-button"
            onClick={handlePlaceOrder}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
