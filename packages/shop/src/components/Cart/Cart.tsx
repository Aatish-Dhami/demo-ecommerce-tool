import { products } from '@flowtel/shared';
import { useCart } from '../../hooks/useCart';
import { CartItem } from './CartItem';
import './Cart.css';

interface CartProps {
  onCheckout?: () => void;
  onContinueShopping?: () => void;
}

export function Cart({ onCheckout, onContinueShopping }: CartProps) {
  const { cart, addToCart, removeFromCart, removeItem } = useCart();

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

  const handleIncrement = (productId: string, productName: string, price: number) => {
    addToCart({ productId, productName, price });
  };

  const handleDecrement = (productId: string) => {
    removeFromCart(productId);
  };

  const handleRemove = (productId: string) => {
    removeItem(productId);
  };

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
    }
  };

  const handleContinueShopping = () => {
    if (onContinueShopping) {
      onContinueShopping();
    }
  };

  const isEmpty = cart.items.length === 0;

  if (isEmpty) {
    return (
      <div className="cart">
        <div className="cart__header">
          <h1 className="cart__title">Shopping Cart</h1>
        </div>
        <div className="cart__empty">
          <p className="cart__empty-message">Your cart is empty</p>
          {onContinueShopping && (
            <button
              className="cart__continue-button"
              onClick={handleContinueShopping}
              type="button"
            >
              Continue Shopping
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="cart__header">
        <h1 className="cart__title">Shopping Cart</h1>
        <span className="cart__item-count">
          {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      <div className="cart__content">
        <div className="cart__items">
          {cart.items.map((item) => (
            <CartItem
              key={item.productId}
              item={item}
              productImage={getProductImage(item.productId)}
              onIncrement={() => handleIncrement(item.productId, item.productName, item.price)}
              onDecrement={() => handleDecrement(item.productId)}
              onRemove={() => handleRemove(item.productId)}
            />
          ))}
        </div>

        <div className="cart__summary">
          <div className="cart__summary-row">
            <span className="cart__summary-label">Subtotal</span>
            <span className="cart__summary-value">{formatPrice(cart.total)}</span>
          </div>
          <div className="cart__summary-row cart__summary-row--total">
            <span className="cart__summary-label">Total</span>
            <span className="cart__summary-value">{formatPrice(cart.total)}</span>
          </div>

          <button
            className="cart__checkout-button"
            onClick={handleCheckout}
            type="button"
          >
            Proceed to Checkout
          </button>

          {onContinueShopping && (
            <button
              className="cart__continue-link"
              onClick={handleContinueShopping}
              type="button"
            >
              Continue Shopping
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
