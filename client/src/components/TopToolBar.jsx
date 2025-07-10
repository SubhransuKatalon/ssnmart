import { useEffect, useState } from 'react';
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

  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.body.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <div className="top-toolbar">
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

      <div className="nav-right">
        <button onClick={() => setIsDark(!isDark)}>
          {isDark ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </button>

        {user ? (
          <button onClick={onLogout} className="logout-button">
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