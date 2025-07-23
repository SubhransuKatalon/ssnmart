import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('searchHistory')) || []);
  const suggestionsRef = useRef();
  const navigate = useNavigate();

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
    const handler = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const updateHistory = (term) => {
    const updated = [term, ...history.filter(h => h !== term)].slice(0, 5);
    setHistory(updated);
    localStorage.setItem('searchHistory', JSON.stringify(updated));
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setHighlightedIndex(-1);

    if (value.trim()) {
      axios.get(`${import.meta.env.VITE_API_URL}/api/products/search?query=${value}`)
        .then(res => setSuggestions(res.data))
        .catch(err => console.error('Search failed:', err));
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectProduct = (id) => {
    updateHistory(search);
    setSearch('');
    setSuggestions([]);
    setHighlightedIndex(-1);
    navigate(`/product/${id}`);
  };

  const highlightMatch = (text) => {
    const regex = new RegExp(`(${search})`, 'i');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? <strong key={i}>{part}</strong> : part
    );
  };

  return (
    <div className="home">
      {/* 🔍 Search Section */}
      <div className="search-section" ref={suggestionsRef}>
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search for products..."
            className="search-input"
            value={search}
            onChange={handleSearchChange}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                setHighlightedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
              } else if (e.key === 'ArrowUp') {
                setHighlightedIndex((prev) => Math.max(prev - 1, 0));
              } else if (e.key === 'Enter') {
                if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
                  handleSelectProduct(suggestions[highlightedIndex]._id);
                }
              }
            }}
          />
          {search && (
            <button className="clear-btn" onClick={() => {
              setSearch('');
              setSuggestions([]);
              setHighlightedIndex(-1);
            }}>❌</button>
          )}
        </div>

        {/* 🔽 Suggestions */}
        {(suggestions.length > 0 || (search && history.length > 0)) && (
          <ul className="suggestions-list">
            {suggestions.length > 0 ? suggestions.map((p, i) => (
              <li
                key={p._id}
                className={i === highlightedIndex ? 'highlighted' : ''}
                onClick={() => handleSelectProduct(p._id)}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <img src={p.image} alt={p.name} className="suggestion-thumb" />
                <span>{highlightMatch(p.name)}</span>
              </li>
            )) : (
              history.map((term, i) => (
                <li key={i} onClick={() => {
                  setSearch(term);
                  handleSearchChange({ target: { value: term } });
                }}>
                  <span>🔁 {term}</span>
                </li>
              ))
            )}
          </ul>
        )}
        {search && suggestions.length === 0 && (
          <div className="no-results">No products found.</div>
        )}
      </div>

      {/* Hero Banner */}
      <div className="hero-banner">
        <img src="/banners/hero-banner.jpg" alt="SSN Mart Deals" />
        <div className="hero-text">
          <h1>Welcome to SSN MART</h1>
          <p className="blink-multicolor">Your one-stop shop for everything!</p>
          <a href="/products" className="btn-shop">🛍️ Start Shopping</a>
        </div>
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