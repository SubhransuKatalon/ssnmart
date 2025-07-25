import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
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
  const navigate = useNavigate();
  const user = localStorage.getItem('user');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // 🔍 Global Search
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

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
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        wrapperRef.current && !wrapperRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clear search on route change
  useEffect(() => {
    setSearch('');
    setSuggestions([]);
    setShowSuggestions(false);
    setNoResults(false);
  }, [location.pathname]);

  // 🔍 Live search logic
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setNoResults(false);
    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (value.trim()) {
        axios.get(`${import.meta.env.VITE_API_URL}/api/products`)
          .then(res => {
            const filtered = res.data.filter(p =>
              p.name.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered.slice(0, 6));
            setShowSuggestions(true);
            setNoResults(filtered.length === 0);
          })
          .catch(() => {
            setSuggestions([]);
            setShowSuggestions(true);
            setNoResults(true);
          });
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
        setNoResults(false);
      }
    }, 300);
  };

  const handleSelectSuggestion = (item) => {
    setSearch('');
    setSuggestions([]);
    setShowSuggestions(false);
    navigate(`/product/${item._id}`);
  };

  const highlightMatch = (text, query) => {
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;
    const before = text.slice(0, index);
    const match = text.slice(index, index + query.length);
    const after = text.slice(index + query.length);
    return <>{before}<strong className="highlight">{match}</strong>{after}</>;
  };

  const hideSearchRoutes = ['/login', '/register'];

  return (
    <div className="top-toolbar">
      {/* Left nav items */}
      <div className="nav-left">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          <FaHome /> <span>Home</span>
        </Link>

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

        {isAdmin && (
          <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
            <FaTools /> <span>Admin</span>
          </Link>
        )}
      </div>

      {/* 🔍 Search bar (hidden on login/register) */}
      {!hideSearchRoutes.includes(location.pathname) && (
        <div className="toolbar-search-section" ref={wrapperRef}>
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={handleSearchChange}
              onFocus={() => {
                if (suggestions.length > 0 || noResults) {
                  setShowSuggestions(true);
                }
              }}
            />
            {search && (
              <span
                className="clear-icon"
                onClick={() => {
                  setSearch('');
                  setSuggestions([]);
                  setShowSuggestions(false);
                  setNoResults(false);
                }}
              >✖</span>
            )}
          </div>
          {showSuggestions && (
            <ul className="suggestions">
              {suggestions.map(item => (
                <li key={item._id} onClick={() => handleSelectSuggestion(item)}>
                  <img src={item.image} alt={item.name} className="suggestion-image" />
                  <span>{highlightMatch(item.name, search)}</span>
                </li>
              ))}
              {noResults && <li className="no-results">No results found</li>}
            </ul>
          )}
        </div>
      )}

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