import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Products.css';

export default function CategoryProducts() {
  const { name: category } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/products?category=${category}`)
      .then(res => setProducts(res.data));
  }, [category]);

  const bannerMap = {
    Electronics: '/banners/electronics.jpg',
    Fashion: '/banners/fashion.jpg',
    'Home & Furniture': '/banners/home.jpg',
    'Beauty & Personal care': '/banners/beauty.jpg',
    Grocery: '/banners/grocery.jpg'
  };

  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    window.location.href = '/login';
    return null;
  }

  const addToCart = (productId) => {
    axios.post(`${import.meta.env.VITE_API_URL}/api/cart`, {
      productId,
      qty: 1,
      userId: user.username
    }).then(() => alert('Added to cart'));
  };

  return (
    <div>
      <img
        src={bannerMap[category] || '/banners/default.jpg'}
        alt={category}
        className="category-banner"
      />
      <h2>{category}</h2>
      {products.length === 0 ? (
        <p>No products found in this category.</p>
      ) : (
        <div className="product-grid">
          {products.map(p => (
            <div key={p._id} className="product-card">
              <img src={p.image} alt={p.name} />
              <h4>{p.name}</h4>
              <p>₹{p.price}</p>
              <p>{p.description}</p>
              <button onClick={() => addToCart(p._id)}>Add to Cart</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}