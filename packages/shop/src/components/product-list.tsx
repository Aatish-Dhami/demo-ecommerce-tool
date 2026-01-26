import { Product } from '@flowtel/shared';
import { ProductCard } from './product-card';
import './product-list.css';

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onProductClick: (productId: string) => void;
}

export function ProductList({
  products,
  onAddToCart,
  onProductClick,
}: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="product-list__empty">
        <p>No products available.</p>
      </div>
    );
  }

  return (
    <section className="product-list">
      <div className="product-list__grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onProductClick={onProductClick}
          />
        ))}
      </div>
    </section>
  );
}
