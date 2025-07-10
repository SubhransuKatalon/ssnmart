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
    className={location.pathname.includes('/category') ? 'active' : ''}
    onClick={() => setShowDropdown(!showDropdown)}
  >
    <FaBoxOpen /> <span>Products ▾</span>
  </button>
  {showDropdown && (
    <div className="dropdown-content">
      <Link to="/category/Electronics" onClick={() => setShowDropdown(false)}>Electronics</Link>
      <Link to="/category/Fashion" onClick={() => setShowDropdown(false)}>Fashion</Link>
      <Link to="/category/Home & Furniture" onClick={() => setShowDropdown(false)}>Home & Furniture</Link>
      <Link to="/category/Beauty & Personal care" onClick={() => setShowDropdown(false)}>Beauty & Personal Care</Link>
      <Link to="/category/Grocery" onClick={() => setShowDropdown(false)}>Grocery</Link>
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
