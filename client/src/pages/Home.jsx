import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const navigate = useNavigate();
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

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
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          .catch(err => {
            console.error('Search failed:', err);
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
      <div className="search-section" ref={wrapperRef}>
        <input
          type="text"
          placeholder="Search for products..."
          className="search-input"
          value={search}
          onChange={handleSearchChange}
          onFocus={() => {
            if (suggestions.length > 0 || noResults) {
              setShowSuggestions(true);
            }
          }}
        />
        {showSuggestions && (
          <ul className="suggestions">
            {suggestions.map(item => (
              <li key={item._id} onClick={() => handleSelectSuggestion(item)} className="suggestion-item">
                <img src={item.image} alt={item.name} className="suggestion-image" />
                <span>{highlightMatch(item.name, search)}</span>
              </li>
            ))}
            {noResults && (
              <li className="no-results">No results found</li>
            )}
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