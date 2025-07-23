import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();
  const debounceRef = useRef(null);
  const inputRef = useRef();
  const suggestionsRef = useRef();

  const categories = [
    { name: 'Electronics', image: '/banners/electronics.jpg' },
    { name: 'Fashion', image: '/banners/fashion.jpg' },
    { name: 'Home & Furniture', image: '/banners/home.jpg' },
    { name: 'Beauty & Personal Care', image: '/banners/beauty.jpg' },
    { name: 'Grocery', image: '/banners/grocery.jpg' },
  ];

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/products/featured`)
      .then(res => setFeatured(res.data))
      .catch(err => console.error('Failed to load featured products:', err));

    axios.get(`${import.meta.env.VITE_API_URL}/api/products/bestsellers`)
      .then(res => setBestsellers(res.data))
      .catch(err => console.error('Failed to load bestsellers:', err));
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setHighlightedIndex(-1);

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (value.trim()) {
        axios
          .get(`${import.meta.env.VITE_API_URL}/api/products/search?query=${value}`)
          .then((res) => {
            setSuggestions(res.data);
            setShowSuggestions(true);
          })
          .catch((err) => console.error('Search failed:', err));
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
  };

  const handleSelectSuggestion = (item) => {
    navigate(`/product/${item._id}`);
    setSearch('');
    setSuggestions([]);
    setShowSuggestions(false);
    setRecentSearches((prev) => {
      const updated = [item.name, ...prev.filter((v) => v !== item.name)];
      return updated.slice(0, 5);
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setHighlightedIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      setHighlightedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        handleSelectSuggestion(suggestions[highlightedIndex]);
      }
    }
  };

  const getHighlightedName = (name) => {
    const idx = name.toLowerCase().indexOf(search.toLowerCase());
    if (idx === -1) return name;
    return (
      <>
        {name.slice(0, idx)}
        <strong>{name.slice(idx, idx + search.length)}</strong>
        {name.slice(idx + search.length)}
      </>
    );
  };

  const clearSearch = () => {
    setSearch('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current.focus();
  };

  return (
    <div className="home">
      {/* Hero Banner */}
      <div className="hero-banner">
        <img src="/banners/hero-banner.jpg" alt="SSN Mart Deals" />
        <div className="hero-text">
          <h1>Welcome to SSN MART</h1>
          <p className="blink-multicolor">Your one-stop shop for everything!</p>
          <a href="/products" className="btn-shop">🛍️ Start Shopping</a>
        </div>
      </div>

      {/* 🔍 Search Bar */}
      <div className="search-section">
        <div style={{ position: 'relative' }}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for products..."
            className="search-input"
            value={search}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
          />
          <span style={{
            position: 'absolute',
            left: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#888'
          }}>🔍</span>

          {search && (
            <button
              onClick={clearSearch}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                fontSize: '16px',
                cursor: 'pointer',
                color: '#888'
              }}
            >
              ❌
            </button>
          )}
        </div>

        {showSuggestions && (
          <ul className="suggestions" ref={suggestionsRef}>
            {suggestions.length === 0 && (
              <li className="suggestion-item">No products found</li>
            )}
            {suggestions.map((item, i) => (
              <li
                key={item._id}
                onClick={() => handleSelectSuggestion(item)}
                className={`suggestion-item ${i === highlightedIndex ? 'highlighted' : ''}`}
              >
                <img src={item.image} alt={item.name} className="suggestion-image" />
                <span>{getHighlightedName(item.name)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Categories */}
      <section className="category-section">
        <h2 className="blink-multicolor">🧭 Shop by Category</h2>
        <div className="categories">
          {categories.map(cat => (
            <a href={`/category/${cat.name}`} className="category-card" key={cat.name}>
              <img src={cat.image} alt={cat.name} />
              <span>{cat.name}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="product-section">
        <h2 className="blink-multicolor">🌟 Featured Products</h2>
        <div className="product-grid">
          {featured.slice(0, 4).map(p => (
            <div className="product-card" key={p._id}>
              <img src={p.image} alt={p.name} />
              <h4>{p.name}</h4>
              <p>₹{p.price}</p>
              <a href={`/product/${p._id}`} className="btn-view">View</a>
            </div>
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="product-section">
        <h2 className="blink-multicolor">🔥 Bestsellers</h2>
        <div className="product-grid">
          {bestsellers.slice(0, 4).map(p => (
            <div className="product-card" key={p._id}>
              <img src={p.image} alt={p.name} />
              <h4>{p.name}</h4>
              <p>₹{p.price}</p>
              <a href={`/product/${p._id}`} className="btn-view">View</a>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonial-section">
        <h2 className="blink-multicolor">💬 What Our Customers Say</h2>
        <div className="testimonials">
          <blockquote>
            "Amazing variety and quick delivery!" <span>- Vaibhav Jain</span>
          </blockquote>
          <blockquote>
            "Found everything I needed at one place. Love SSN Mart!" <span>- Mohit Kumar</span>
          </blockquote>
          <blockquote>
            "Super smooth checkout and great prices." <span>- Sanya M.</span>
          </blockquote>
        </div>
      </section>
    </div>
  );
}