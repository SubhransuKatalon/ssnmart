import { Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import {
  FaHome,
  FaBoxOpen,
  FaShoppingCart,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaTools
} from 'react-icons/fa';
import './TopToolBar.css';

export default function TopToolBar({ onLogout, isAdmin }) {
  const location = useLocation();
  const user = localStorage.getItem('user');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const categories = [
    'Electronics',
    'Fashion',
    'Home & Furniture',
    'Beauty & Personal care',
    'Grocery'
  ];

  // ✅ Hide dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="top-toolbar">
      {/* Left nav items */}
      <div className="nav-left">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          <FaHome /> <span>Home</span>
        </Link>

        {/* Dropdown Menu for Products */}
        <div className="dropdown" ref={dropdownRef}>
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
                  to={`/category/${encodeURIComponent(cat)}`}
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

        {/* ✅ Admin Link */}
        {isAdmin && (
          <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
            <FaTools /> <span>Admin</span>
          </Link>
        )}
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