import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

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
      .get('${import.meta.env.VITE_API_URL}/api/cart?userId=${user.username}')
      .then((res) => {
        setCart(res.data.items);
        setTotal(res.data.total);
      });
  }, []);

  const updateQty = (productId, delta) => {
    const item = cart.find(p => p.product._id === productId);
    const newQty = Math.max(1, item.qty + delta);
    axios
      .post('${import.meta.env.VITE_API_URL}/api/cart', {
        productId,
        qty: newQty,
        userId: user.username
      })
      .then(() => {
        setCart(cart.map(p =>
          p.product._id === productId ? { ...p, qty: newQty } : p
        ));
        setTotal(
          cart.reduce((sum, item) =>
            item.product._id === productId
              ? sum + item.product.price * newQty
              : sum + item.product.price * item.qty,
            0
          ).toFixed(2)
        );
      });
  };

  const removeItem = (productId) => {
    axios
      .post('${import.meta.env.VITE_API_URL}/api/cart', {
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
    <div>
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <ul>
          {cart.map(item => (
            <li key={item.product._id}>
              {item.product.name} - ${item.product.price} x {item.qty}
              <button onClick={() => updateQty(item.product._id, -1)}>-</button>
              <button onClick={() => updateQty(item.product._id, 1)}>+</button>
              <button onClick={() => removeItem(item.product._id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <h3>Total: ${total}</h3>
      {cart.length > 0 && <Link to="/payment"><button>Checkout</button></Link>}
    </div>
  );
}
