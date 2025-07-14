import { useState } from 'react';
import './Payment.css';

export default function Payment() {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    name: '',
    number: '',
    expiry: '',
    cvv: ''
  });

  const handleInputChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  const handlePayment = (e) => {
    e.preventDefault();
    alert('✅ Payment simulated successfully!');
  };

  return (
    <div className="payment-container">
      <h2>Checkout</h2>
      <form onSubmit={handlePayment} className="payment-form">
        <label>Choose Payment Method:</label>
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="card">Credit/Debit Card</option>
          <option value="upi">UPI</option>
          <option value="cod">Cash on Delivery</option>
        </select>

        {paymentMethod === 'card' && (
          <div className="card-details">
            <input
              type="text"
              name="name"
              placeholder="Name on Card"
              value={cardDetails.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="number"
              placeholder="Card Number"
              value={cardDetails.number}
              onChange={handleInputChange}
              maxLength={16}
              required
            />
            <div className="card-row">
              <input
                type="text"
                name="expiry"
                placeholder="MM/YY"
                value={cardDetails.expiry}
                onChange={handleInputChange}
                maxLength={5}
                required
              />
              <input
                type="password"
                name="cvv"
                placeholder="CVV"
                value={cardDetails.cvv}
                onChange={handleInputChange}
                maxLength={3}
                required
              />
            </div>
          </div>
        )}

        {paymentMethod === 'upi' && (
          <input type="text" placeholder="Enter UPI ID" required />
        )}

        {paymentMethod === 'cod' && (
          <p>Pay with cash when your order is delivered.</p>
        )}

        <button type="submit" className="pay-btn">Pay Now</button>
      </form>
    </div>
  );
}