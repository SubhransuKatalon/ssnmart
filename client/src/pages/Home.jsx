import { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const categories = [
    { name: 'Electronics', image: '/banners/electronics.jpg' },
    { name: 'Fashion', image: '/banners/fashion.jpg' },
    { name: 'Home & Furniture', image: '/banners/home.jpg' },
    { name: 'Beauty & Personal Care', image: '/banners/beauty.jpg' },
    { name: 'Grocery', image: '/banners/grocery.jpg' },
  ];

  useEffect(() => {
    // Fetch featured products
    axios.get(`${import.meta.env.VITE_API_URL}/api/products/featured`)
      .then(res => setFeatured(res.data))
      .catch(err => console.error('Failed to load featured products:', err));

    // Fetch bestsellers
    axios.get(`${import.meta.env.VITE_API_URL}/api/products/bestsellers`)
      .then(res => setBestsellers(res.data))
      .catch(err => console.error('Failed to load bestsellers:', err));
  }, []);

  return (
    <div className="home">
      {/* Hero Banner */}
      <div className="hero-banner">
        <img src="/banners/hero-banner.jpg" alt="SSN Mart Deals" />
        <div className="hero-text">
          <h1 className="blink-multicolor">Welcome to SSN MART</h1>
          <p className="blink-multicolor">Your one-stop shop for everything!</p>
          <a href="/products" className="btn-shop blink-multicolor">🛍️ Start Shopping</a>
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
          {featured.slice(0,4).map(p => (
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
          {bestsellers.slice(0,4).map(p => (
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