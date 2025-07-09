import { Link, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaBoxOpen,
  FaShoppingCart,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
} from 'react-icons/fa';
import './TopToolBar.css';

export default function TopToolBar() {
  const location = useLocation();
  const user = localStorage.getItem('user');

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="top-toolbar">
      {/* Left nav items */}
      <div className="nav-left">
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

      {/* Right auth links */}
      <div className="nav-right">
        {user ? (
          <button onClick={handleLogout} className="logout-button">
            <FaSignOutAlt /> <span>Logout</span>
          </button>
        ) : (
          <>
            <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>
              <FaSignInAlt /> <span>Login</span>
            </Link>
            <Link to="/register" className={location.pathname === '/register' ? 'active' : ''}>
              <FaUserPlus /> <span>Register</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
