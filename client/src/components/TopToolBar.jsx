import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
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
  const [showDropdown, setShowDropdown] = useState(false);

  const categories = [
    'Electronics',
    'Fashion',
    'Home & Furniture',
    'Beauty & Personal care',
    'Grocery'
  ];

  return (
    <div className="top-toolbar">
      {/* Left nav items */}
      <div className="nav-left">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          <FaHome /> <span>Home</span>
        </Link>

        {/* Dropdown Menu for Products */}
        <div className="dropdown">
          <button
            name="product-dropdown"
            className={location.pathname.includes('/category') ? 'active' : ''}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <FaBoxOpen /> <span>Products ▾</span>
          </button>
          {showDropdown && (
            <div className="dropdown-content">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  to={`/category/${encodeURIComponent(cat)}`} // ✅ auto-encode
                  onClick={() => setShowDropdown(false)}
                >
                  {cat}
                </Link>
              ))}
            </div>
          )}
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