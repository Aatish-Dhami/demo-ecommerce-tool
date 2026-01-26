import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '@flowtel/shared';
import { ProductDetail } from '../components/ProductDetail/ProductDetail';
import { useCart } from '../hooks/useCart';
import { track, EventType } from '../lib/tracker';

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const product = products.find((p) => p.id === id);
    if (product) {
      track(EventType.PRODUCT_VIEWED, {
        productId: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
      });
    }
  }, [id]);

  const handleBack = () => {
    navigate('/');
  };

  const handleAddToCart = (productId: string, quantity: number) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      track(EventType.ADD_TO_CART, {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
      });

      for (let i = 0; i < quantity; i++) {
        addToCart({
          productId: product.id,
          productName: product.name,
          price: product.price,
        });
      }
    }
  };

  if (!id) {
    return <div>Product ID is required</div>;
  }

  return (
    <ProductDetail
      productId={id}
      onAddToCart={handleAddToCart}
      onBack={handleBack}
    />
  );
}
