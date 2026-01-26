import { CartItem as CartItemType } from '@flowtel/shared';
import './CartItem.css';

interface CartItemProps {
  item: CartItemType;
  productImage: string;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

export function CartItem({
  item,
  productImage,
  onIncrement,
  onDecrement,
  onRemove,
}: CartItemProps) {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const lineTotal = item.price * item.quantity;

  return (
    <div className="cart-item">
      <div className="cart-item__image-container">
        <img
          src={productImage}
          alt={item.productName}
          className="cart-item__image"
        />
      </div>

      <div className="cart-item__details">
        <h3 className="cart-item__name">{item.productName}</h3>
        <p className="cart-item__price">{formatPrice(item.price)} each</p>
      </div>

      <div className="cart-item__quantity">
        <button
          className="cart-item__quantity-button"
          onClick={onDecrement}
          aria-label="Decrease quantity"
          type="button"
        >
          -
        </button>
        <span className="cart-item__quantity-value">{item.quantity}</span>
        <button
          className="cart-item__quantity-button"
          onClick={onIncrement}
          aria-label="Increase quantity"
          type="button"
        >
          +
        </button>
      </div>

      <div className="cart-item__total">
        {formatPrice(lineTotal)}
      </div>

      <button
        className="cart-item__remove"
        onClick={onRemove}
        aria-label={`Remove ${item.productName} from cart`}
        type="button"
      >
        Remove
      </button>
    </div>
  );
}
