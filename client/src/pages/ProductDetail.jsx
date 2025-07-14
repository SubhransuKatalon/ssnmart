import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error('Error fetching product:', err));
  }, [id]);

  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    window.location.href = '/login';
    return null;
  }

  const addToCart = () => {
    axios.post(`${import.meta.env.VITE_API_URL}/api/cart`, {
      productId: product._id,
      qty: 1,
      userId: user.username
    }).then(() => alert('Added to cart'));
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-detail-container">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      <div className="product-detail">
        <div className="left">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="right">
          <h2>{product.name}</h2>
          <p className="price">₹{product.price}</p>
          <p className="desc">{product.description}</p>
          <p className="spec">Specification: Lorem ipsum dolor sit amet.</p>
          <button className="add-btn" onClick={addToCart}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}