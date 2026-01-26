import { Link } from 'react-router-dom';
import './OrderConfirmationPage.css';

export function OrderConfirmationPage() {
  return (
    <div className="order-confirmation-page">
      <div className="order-confirmation-page__content">
        <div className="order-confirmation-page__icon">✓</div>
        <h1 className="order-confirmation-page__title">Order Confirmed!</h1>
        <p className="order-confirmation-page__message">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
        <p className="order-confirmation-page__note">
          This is a demo shop. No real order has been processed.
        </p>
        <Link to="/" className="order-confirmation-page__link">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
