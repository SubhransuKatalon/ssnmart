import { Link } from 'react-router-dom';
import './Navbar.css'; // custom styling

export default function Navbar({ onLogout }) {
  const isLoggedIn = !!localStorage.getItem('user');

  return (
    <nav className="navbar">
      {/* Left side: Logo + Site Name */}
      <div className="nav-left">
        <img src="/favicon.png" alt="SSN Mart Logo" height="40" />
        <span className="brand">SSN Mart</span>
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/products" className="nav-link">Products</Link>
        <Link to="/cart" className="nav-link">Cart</Link>
      </div>

      {/* Right side: Auth links */}
      <div className="nav-right">
        {isLoggedIn ? (
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem('user');
              if (onLogout) onLogout();
              window.location.href = '/login';
            }}
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
