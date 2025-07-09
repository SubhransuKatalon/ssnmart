// client/src/components/Navbar.jsx
import { Link } from 'react-router-dom';

export default function Navbar({ onLogout }) {
  const isLoggedIn = localStorage.getItem('user');

  return (
    <nav>
      <Link to="/">Home</Link> | <Link to="/products">Products</Link> | <Link to="/cart">Cart</Link>
      {isLoggedIn ? (
        <>
          {' | '}
          <button onClick={onLogout}>Logout</button>
        </>
      ) : (
        <>
          {' | '}
          <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}
