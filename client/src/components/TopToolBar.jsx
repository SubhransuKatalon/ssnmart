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

export default function TopToolBar({ onLogout }) {
  const location = useLocation();
  const user = localStorage.getItem('user');

  return (
    <div className="top-toolbar">
      {/* Left nav items */}
      <div className="nav-left">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          <FaHome /> <span>Home</span>
        </Link>

        {/* Dropdown Menu for Products */}
        <div className="dropdown">
          <span className={location.pathname.includes('/category') ? 'active' : ''}>
            <FaBoxOpen /> <span>Products ▾</span>
          </span>
          <div className="dropdown-content">
            <Link to="/category/Electronics">Electronics</Link>
            <Link to="/category/Fashion">Fashion</Link>
            <Link to="/category/Home & Furniture">Home & Furniture</Link>
            <Link to="/category/Beauty & Personal care">Beauty & Personal Care</Link>
            <Link to="/category/Grocery">Grocery</Link>
          </div>
        </div>

        <Link to="/cart" className={location.pathname === '/cart' ? 'active' : ''}>
          <FaShoppingCart /> <span>Cart</span>
        </Link>
      </div>

      {/* Right auth links */}
      <div className="nav-right">
        {user ? (
          <button onClick={onLogout} className="logout-button">
            <FaSignOutAlt /> <span>Logout</span>
          </button>
        ) : (
          <>
            <Link to="/login">
              <FaSignInAlt /> <span>Login</span>
            </Link>
            <Link to="/register">
              <FaUserPlus /> <span>Register</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
