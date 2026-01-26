import { Product } from '@flowtel/shared';
import './product-card.css';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onProductClick: (productId: string) => void;
}

export function ProductCard({
  product,
  onAddToCart,
  onProductClick,
}: ProductCardProps) {
  const handleAddToCart = (event: React.MouseEvent) => {
    event.stopPropagation();
    onAddToCart(product);
  };

  const handleCardClick = () => {
    onProductClick(product.id);
  };

  const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <article
      className="product-card"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
    >
      <div className="product-card__image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-card__image"
          loading="lazy"
        />
      </div>
      <div className="product-card__content">
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__price">{formatPrice(product.price)}</p>
        <button
          className="product-card__add-button"
          onClick={handleAddToCart}
          type="button"
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}
