import { useNavigate } from 'react-router-dom';
import { Product, products } from '@flowtel/shared';
import { ProductList } from '../components';
import { useCart } from '../hooks/useCart';
import { track, EventType } from '../lib/tracker';

export function HomePage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (product: Product) => {
    track(EventType.ADD_TO_CART, {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });

    addToCart({
      productId: product.id,
      productName: product.name,
      price: product.price,
    });
  };

  return (
    <ProductList
      products={products}
      onAddToCart={handleAddToCart}
      onProductClick={handleProductClick}
    />
  );
}
