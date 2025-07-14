import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Payment.css';

export default function Payment() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    name: '',
    number: '',
    expiry: '',
    cvv: ''
  });
  const [upiId, setUpiId] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleInputChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    try {
      const configRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/payment-config`);
      const config = configRes.data;

      let valid = false;
      let txnDetails = {};

      if (paymentMethod === 'card') {
        valid =
          config.card &&
          config.card.name === cardDetails.name &&
          config.card.number === cardDetails.number &&
          config.card.expiry === cardDetails.expiry &&
          config.card.cvv === cardDetails.cvv;

        txnDetails = { method: 'Card', details: cardDetails };

      } else if (paymentMethod === 'upi') {
        valid = config.upi && config.upi === upiId;
        txnDetails = { method: 'UPI', details: { upiId } };

      } else {
        valid = true;
        txnDetails = { method: 'Cash on Delivery', details: {} };
      }

      const txnPayload = {
        ...txnDetails,
        status: valid ? 'success' : 'failed',
        timestamp: new Date().toISOString()
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/api/transactions`, txnPayload);

      if (valid) {
        setStatus('success');
        setMessage('✅ Payment successful!');
        setTimeout(() => navigate('/'), 2000);
      } else {
        setStatus('error');
        setMessage('❌ Transaction failed. Invalid payment details.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('❌ Something went wrong.');
    }
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
          <input
            type="text"
            placeholder="Enter UPI ID"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            required
          />
        )}

        {paymentMethod === 'cod' && (
          <p>Pay with cash when your order is delivered.</p>
        )}

        <button type="submit" className="pay-btn">Pay Now</button>
      </form>

      {message && (
        <div className={`payment-msg ${status}`}>
          {message}
        </div>
      )}
    </div>
  );
}