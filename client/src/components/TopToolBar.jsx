import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBoxOpen, FaShoppingCart } from 'react-icons/fa';
import './TopToolBar.css';

export default function TopToolBar() {
  const location = useLocation();

  return (
    <div className="top-toolbar">
      <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
        <FaHome /> <span>Home</span>
      </Link>
      <Link to="/products" className={location.pathname === '/products' ? 'active' : ''}>
        <FaBoxOpen /> <span>Products</span>
      </Link>
      <Link to="/cart" className={location.pathname === '/cart' ? 'active' : ''}>
        <FaShoppingCart /> <span>Cart</span>
      </Link>
    </div>
  );
}