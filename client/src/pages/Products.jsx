import { useEffect, useState } from 'react';
import axios from 'axios';
import './Products.css';

export default function Products() {
  const [products, setProducts] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    window.location.href = '/login';
    return null;
  }

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/products`)
      .then(res => setProducts(res.data));
  }, []);

  const addToCart = (productId) => {
    axios.post(`${import.meta.env.VITE_API_URL}/api/cart`, {
      productId,
      qty: 1,
      userId: user.username
    }).then(() => alert('Added to cart'));
  };

  return (
    <div>
      <h2>All Products</h2>
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
    </div>
  );
}