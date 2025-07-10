import { useEffect, useState } from 'react';
import axios from 'axios';
import './Products.css';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Add loading state

  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    window.location.href = '/login';
    return null;
  }

  useEffect(() => {
    setLoading(true); // Start loading
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/products`)
      .then(res => {
        setProducts(res.data);
        setLoading(false); // Stop loading
      })
      .catch(err => {
        console.error('Failed to fetch products', err);
        setLoading(false);
      });
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

      {loading ? (
        <p>Loading products...</p> // ✅ Show while loading
      ) : (
        <div className="product-grid">
          {products.map(p => (
            <div key={p._id} className="product-card">
              <img
                src={p.image || '/fallback.jpg'}
                alt={p.name}
                onError={(e) => { e.target.src = '/fallback.jpg'; }}
              />
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