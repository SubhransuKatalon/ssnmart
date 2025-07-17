import { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const categories = [
    { name: 'Electronics', image: '/images/categories/electronics.jpg' },
    { name: 'Fashion', image: '/images/categories/fashion.jpg' },
    { name: 'Home & Furniture', image: '/images/categories/home.jpg' },
    { name: 'Beauty & Personal Care', image: '/images/categories/beauty.jpg' },
    { name: 'Grocery', image: '/images/categories/grocery.jpg' },
  ];

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/products`)
      .then(res => {
        const all = res.data;
        setFeatured(all.slice(0, 4));
        setBestsellers([...all].sort((a, b) => b.sold - a.sold).slice(0, 4));
      })
      .catch(err => console.error('Failed to load products:', err));
  }, []);

  return (
    <div className="home">
      {/* Hero Banner */}
      <div className="hero-banner">
        <img src="/images/hero-banner.jpg" alt="SSN Mart Deals" />
        <div className="hero-text">
          <h1>Welcome to SSN Mart</h1>
          <p>Your one-stop shop for everything!</p>
          <a href="/products" className="btn-shop">🛍️ Start Shopping</a>
        </div>
      </div>

      {/* Categories */}
      <section className="category-section">
        <h2>🧭 Shop by Category</h2>
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
        <h2>🌟 Featured Products</h2>
        <div className="product-grid">
          {featured.map(p => (
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
        <h2>🔥 Bestsellers</h2>
        <div className="product-grid">
          {bestsellers.map(p => (
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
        <h2>💬 What Our Customers Say</h2>
        <div className="testimonials">
          <blockquote>
            "Amazing variety and quick delivery!" <span>- Priya K.</span>
          </blockquote>
          <blockquote>
            "Found everything I needed at one place. Love SSN Mart!" <span>- Rahul S.</span>
          </blockquote>
          <blockquote>
            "Super smooth checkout and great prices." <span>- Anjali M.</span>
          </blockquote>
        </div>
      </section>
    </div>
  );
}