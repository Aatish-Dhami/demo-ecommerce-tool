import { useEffect, useState } from 'react';
import { useCart } from '../hooks/useCart';
import './OrderConfirmation.css';

interface OrderConfirmationProps {
  onContinueShopping?: () => void;
}

export function OrderConfirmation({ onContinueShopping }: OrderConfirmationProps) {
  const { clearCart } = useCart();
  const [orderId] = useState(() => crypto.randomUUID());

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="order-confirmation">
      <div className="order-confirmation__icon">✓</div>
      <h1 className="order-confirmation__title">Order Confirmed!</h1>
      <p className="order-confirmation__message">
        Thank you for your purchase. Your order has been placed successfully.
      </p>
      <div className="order-confirmation__order-id">
        <span className="order-confirmation__order-id-label">Order ID:</span>
        <span className="order-confirmation__order-id-value">{orderId}</span>
      </div>
      {onContinueShopping && (
        <button
          className="order-confirmation__continue-button"
          onClick={onContinueShopping}
        >
          Continue Shopping
        </button>
      )}
    </div>
  );
}
