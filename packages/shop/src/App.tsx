import { Product, products } from '@flowtel/shared';
import { ProductList } from './components';
import './App.css';

function App() {
  const handleAddToCart = (product: Product) => {
    console.log('[Cart] Add to cart:', {
      id: product.id,
      name: product.name,
      price: product.price,
    });
  };

  const handleProductClick = (productId: string) => {
    console.log('[Navigation] Navigate to product:', productId);
  };

  return (
    <div className="app">
      <header className="app__header">
        <h1>Flowtel Shop</h1>
      </header>
      <main className="app__main">
        <ProductList
          products={products}
          onAddToCart={handleAddToCart}
          onProductClick={handleProductClick}
        />
      </main>
    </div>
  );
}

export default App;
