import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function CategoryProducts() {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/products?category=${encodeURIComponent(categoryName)}`)
      .then((res) => setProducts(res.data));
  }, [categoryName]);

  const user = JSON.parse(localStorage.getItem('user'));

  const addToCart = (productId) => {
    axios.post(`${import.meta.env.VITE_API_URL}/api/cart`, {
      productId,
      qty: 1,
      userId: user?.username,
    });
  };

  return (
    <div>
      <h2>{categoryName} Products</h2>
      {products.length === 0 ? (
        <p>No products found in this category.</p>
      ) : (
        products.map((p) => (
          <div key={p._id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <img src={p.image} alt={p.name} height="100" />
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <strong>₹{p.price}</strong>
            <br />
            <button onClick={() => addToCart(p._id)}>Add to Cart</button>
          </div>
        ))
      )}
    </div>
  );
}