// In Admin.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';

export default function Admin() {
  const [form, setForm] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
    category: 'Electronics'
  });

  const [specInput, setSpecInput] = useState('');
  const [specifications, setSpecifications] = useState([]);
  const [defaultCard, setDefaultCard] = useState({ name: '', number: '', expiry: '', cvv: '' });
  const [defaultUPI, setDefaultUPI] = useState('');
  const [transactions, setTransactions] = useState([]);

  const categories = [
    'Electronics',
    'Fashion',
    'Home & Furniture',
    'Beauty & Personal care',
    'Grocery'
  ];

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/transactions`)
      .then(res => setTransactions(res.data))
      .catch(err => console.error('Failed to fetch transactions:', err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addSpec = () => {
    if (specInput.trim()) {
      setSpecifications([...specifications, specInput.trim()]);
      setSpecInput('');
    }
  };

  const removeSpec = (index) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${import.meta.env.VITE_API_URL}/api/products`, {
      ...form,
      price: Number(form.price),
      specifications
    })
      .then(() => {
        alert('✅ Product added!');
        setForm({ name: '', price: '', image: '', description: '', category: 'Electronics' });
        setSpecifications([]);
      })
      .catch(() => alert('❌ Failed to add product'));
  };

  const savePaymentDefaults = () => {
    axios.post(`${import.meta.env.VITE_API_URL}/api/payment-config`, {
      card: defaultCard,
      upi: defaultUPI
    })
      .then(() => {
        alert('✅ Payment validation data saved to server.');
      })
      .catch(() => {
        alert('❌ Failed to save payment config to server.');
      });
  };

  return (
    <div className="admin-container">
      <h2>Add Product (Admin)</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
        <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} required />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
        <select name="category" onChange={handleChange} value={form.category}>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>

        <div className="spec-section">
          <input
            type="text"
            placeholder="Add Specification"
            value={specInput}
            onChange={(e) => setSpecInput(e.target.value)}
          />
          <button type="button" className="add-spec-btn" onClick={addSpec}>
            Add Spec {specifications.length + 1}
          </button>
        </div>

        <ul className="spec-list">
          {specifications.map((spec, idx) => (
            <li key={idx}>
              {spec}
              <button type="button" className="remove-spec-btn" onClick={() => removeSpec(idx)}>❌</button>
            </li>
          ))}
        </ul>

        <button type="submit">Add Product</button>
      </form>

      <hr />
      <h3>Set Valid Payment Details</h3>
      <div className="payment-defaults">
        <label>Card Number:</label>
        <input value={defaultCard.number} onChange={e => setDefaultCard({ ...defaultCard, number: e.target.value })} />
        <label>Expiry (MM/YY):</label>
        <input value={defaultCard.expiry} onChange={e => setDefaultCard({ ...defaultCard, expiry: e.target.value })} />
        <label>CVV:</label>
        <input value={defaultCard.cvv} onChange={e => setDefaultCard({ ...defaultCard, cvv: e.target.value })} />
        <label>Card Holder Name:</label>
        <input value={defaultCard.name} onChange={e => setDefaultCard({ ...defaultCard, name: e.target.value })} />

        <label>Valid UPI ID:</label>
        <input value={defaultUPI} onChange={e => setDefaultUPI(e.target.value)} />

        <button onClick={savePaymentDefaults} style={{ marginTop: '10px' }}>Save Payment Defaults</button>
      </div>

      <hr />
      <h3>🧾 Transaction Logs</h3>
      <div className="transaction-log">
        {transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Method</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(txn => (
                <tr key={txn._id}>
                  <td>{txn.user || 'Anonymous'}</td>
                  <td>{txn.method}</td>
                  <td style={{ color: txn.status === 'success' ? 'green' : 'red' }}>{txn.status}</td>
                  <td>₹{txn.amount}</td>
                  <td>{txn.createdAt ? new Date(txn.createdAt).toLocaleString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}