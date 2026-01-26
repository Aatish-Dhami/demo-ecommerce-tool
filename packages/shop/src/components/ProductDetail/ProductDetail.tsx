import { useState, useEffect } from 'react';
import { Product, products } from '@flowtel/shared';
import { track, EventType } from '../../lib/tracker';
import './ProductDetail.css';

interface ProductDetailProps {
  productId: string;
  onAddToCart?: (productId: string, quantity: number) => void;
  onBack?: () => void;
}

export function ProductDetail({ productId, onAddToCart, onBack }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p: Product) => p.id === productId);

  // Track product_viewed on component mount
  useEffect(() => {
    if (product) {
      track(EventType.PRODUCT_VIEWED, {
        productId: product.id,
        productName: product.name,
        price: product.price,
      });
    }
  }, [product]);

  if (!product) {
    return (
      <div className="product-detail">
        <div className="product-detail__not-found">
          <h2>Product Not Found</h2>
          <p>The product you're looking for doesn't exist.</p>
          {onBack && (
            <button className="product-detail__back-button" onClick={onBack}>
              Back to Products
            </button>
          )}
        </div>
      </div>
    );
  }

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product.id, quantity);
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="product-detail">
      {onBack && (
        <button className="product-detail__back-link" onClick={onBack}>
          &larr; Back to Products
        </button>
      )}

      <div className="product-detail__content">
        <div className="product-detail__image-container">
          <img
            src={product.image}
            alt={product.name}
            className="product-detail__image"
          />
        </div>

        <div className="product-detail__info">
          <span className="product-detail__category">{product.category}</span>
          <h1 className="product-detail__name">{product.name}</h1>
          <p className="product-detail__description">{product.description}</p>
          <p className="product-detail__price">{formatPrice(product.price)}</p>

          <div className="product-detail__actions">
            <div className="product-detail__quantity">
              <button
                className="product-detail__quantity-button"
                onClick={handleDecrement}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <input
                type="number"
                className="product-detail__quantity-input"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
                aria-label="Quantity"
              />
              <button
                className="product-detail__quantity-button"
                onClick={handleIncrement}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              className="product-detail__add-to-cart"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
