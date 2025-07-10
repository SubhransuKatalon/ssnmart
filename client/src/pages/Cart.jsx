import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Cart.css'; // You can define styles here

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    window.location.href = '/login';
    return null;
  }

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/cart?userId=${user.username}`)
      .then((res) => {
        setCart(res.data.items);
        setTotal(res.data.total);
      });
  }, []);

  const updateQty = (productId, delta) => {
    const item = cart.find(p => p.product._id === productId);
    if (!item) return;
    const newQty = Math.max(1, item.qty + delta);
    axios
      .post(`${import.meta.env.VITE_API_URL}/api/cart`, {
        productId,
        qty: newQty,
        userId: user.username
      })
      .then(() => {
        const updatedCart = cart.map(p =>
          p.product._id === productId ? { ...p, qty: newQty } : p
        );
        setCart(updatedCart);
        setTotal(
          updatedCart.reduce((sum, item) => sum + item.product.price * item.qty, 0).toFixed(2)
        );
      });
  };

  const removeItem = (productId) => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/api/cart`, {
        productId,
        qty: 0,
        userId: user.username
      })
      .then(() => {
        const newCart = cart.filter(p => p.product._id !== productId);
        setCart(newCart);
        setTotal(
          newCart.reduce((sum, item) => sum + item.product.price * item.qty, 0).toFixed(2)
        );
      });
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <div className="cart-items">
          {cart.map((item, index) => (
            <div key={item.product._id} className="cart-item">
              <img src={item.product.image} alt={item.product.name} />
              <div className="cart-item-info">
                <h4>{item.product.name}</h4>
                <p>Price: ₹{item.product.price}</p>
                <div className="qty-control">
                  <button onClick={() => updateQty(item.product._id, -1)}>-</button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item.product._id, 1)}>+</button>
                </div>
                <button onClick={() => removeItem(item.product._id)} className="remove-btn">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <h3>Total: ₹{total}</h3>
      {cart.length > 0 && (
        <Link to="/payment">
          <button className="checkout-btn">Checkout</button>
        </Link>
      )}
    </div>
  );
}
