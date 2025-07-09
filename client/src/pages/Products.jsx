import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);  // NEW
  const [error, setError] = useState(null);      // NEW

  // 🔐 Redirect to login if not authenticated
  if (!localStorage.getItem('user')) {
    window.location.href = '/login';
    return null;
  }

  useEffect(() => {
    axios
      .get('${import.meta.env.VITE_API_URL}/api/products')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load products:', err);
        setError('Failed to load products');
        setLoading(false);
      });
  }, []);

const user = JSON.parse(localStorage.getItem('user'));
const addToCart = (productId) => {
  axios.post('${import.meta.env.VITE_API_URL}/api/cart', {
    productId,
    qty: 1,
    userId: user.username  // or user._id if available
  }).then(() => {
    alert('Added to cart');
  });
};


  if (loading) return <div>Loading products...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Products</h2>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        products.map(p => (
          <div key={p._id}>
            <strong>{p.name}</strong> - ₹{p.price}
            <button onClick={() => addToCart(p._id)}>Add to Cart</button>
          </div>
        ))
      )}
    </div>
  );
}
