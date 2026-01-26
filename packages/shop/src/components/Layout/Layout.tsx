import { Outlet, Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import './Layout.css';

export function Layout() {
  const { cart } = useCart();
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="layout">
      <header className="layout__header">
        <Link to="/" className="layout__logo">
          <h1>Flowtel Shop</h1>
        </Link>
        <nav className="layout__nav">
          <Link to="/cart" className="layout__cart-link">
            Cart {itemCount > 0 && <span className="layout__cart-badge">({itemCount})</span>}
          </Link>
        </nav>
      </header>
      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  );
}
