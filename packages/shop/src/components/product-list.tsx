import { useEffect } from 'react';
import { Product } from '@flowtel/shared';
import { ProductCard } from './product-card';
import { track, EventType } from '../lib/tracker';
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
  useEffect(() => {
    track(EventType.PAGE_VIEW, {
      url: window.location.href,
      path: window.location.pathname,
      page: 'product_list',
    });
  }, []);

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
