import { useNavigate } from 'react-router-dom';
import { Product, products } from '@flowtel/shared';
import { ProductList } from '../components';
import { useCart } from '../hooks/useCart';

export function HomePage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (product: Product) => {
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
