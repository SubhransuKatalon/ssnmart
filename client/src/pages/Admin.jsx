import { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('product');
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
  const [pendingUsers, setPendingUsers] = useState([]);
  const [declinedUsers, setDeclinedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ status: '', user: '', date: '' });
  const [userTab, setUserTab] = useState('new');

  const categories = [
    'Electronics',
    'Fashion',
    'Home & Furniture',
    'Beauty & Personal care',
    'Grocery'
  ];

  useEffect(() => {
    if (activeTab === 'transactions') {
      setLoading(true);
      axios.get(`${import.meta.env.VITE_API_URL}/api/transactions`)
        .then(res => setTransactions(res.data))
        .catch(err => console.error('Failed to fetch transactions:', err))
        .finally(() => setLoading(false));
    }

    if (activeTab === 'users') {
      axios.get(`${import.meta.env.VITE_API_URL}/api/users/pending`)
        .then(res => setPendingUsers(res.data))
        .catch(err => console.error('Failed to fetch users:', err));

      axios.get(`${import.meta.env.VITE_API_URL}/api/users/declined`)
        .then(res => setDeclinedUsers(res.data))
        .catch(err => console.error('Failed to fetch declined users:', err));
    }
  }, [activeTab]);

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
    if (!window.confirm('Save these payment credentials?')) return;
    axios.post(`${import.meta.env.VITE_API_URL}/api/payment-config`, {
      card: defaultCard,
      upi: defaultUPI
    })
      .then(() => {
        alert('✅ Payment config saved!');
        setDefaultCard({ name: '', number: '', expiry: '', cvv: '' });
        setDefaultUPI('');
      })
      .catch(() => alert('❌ Failed to save payment config.'));
  };

  const handleUserApproval = (username, approve) => {
    axios.post(`${import.meta.env.VITE_API_URL}/api/users/approval`, { username, approve })
      .then(() => {
        alert(`User ${approve ? 'approved' : 'declined'}!`);
        setPendingUsers(prev => prev.filter(u => u.username !== username));
        setDeclinedUsers(prev =>
          approve ? prev.filter(u => u.username !== username)
                  : [...prev, { username }]
        );
      })
      .catch(() => alert('❌ Failed to update user status.'));
  };

  const filteredTransactions = transactions
    .filter(txn =>
      (!filters.status || txn.status === filters.status) &&
      (!filters.user || txn.user?.toLowerCase().includes(filters.user.toLowerCase())) &&
      (!filters.date || new Date(txn.createdAt).toLocaleDateString() === filters.date)
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>

      {/* Main Tabs */}
      <div className="admin-tabs">
        <button className={activeTab === 'product' ? 'active' : ''} onClick={() => setActiveTab('product')}>Add Product</button>
        <button className={activeTab === 'payment' ? 'active' : ''} onClick={() => setActiveTab('payment')}>Payment Config</button>
        <button className={activeTab === 'transactions' ? 'active' : ''} onClick={() => setActiveTab('transactions')}>Transaction Logs</button>
        <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>Users Registration</button>
      </div>

      {/* Product Tab */}
      {activeTab === 'product' && (
        <div className="admin-section fade-in">
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
        </div>
      )}

      {/* Payment Config Tab */}
      {activeTab === 'payment' && (
        <div className="admin-section fade-in payment-defaults">
          <label>Card Number:</label>
          <input value={defaultCard.number} onChange={e => {
            const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
            const formatted = raw.replace(/(.{4})/g, '$1-').replace(/-$/, '');
            setDefaultCard({ ...defaultCard, number: formatted });
          }} placeholder="1234-5678-9012-3456" />
          <label>Expiry (MM/YY):</label>
          <input value={defaultCard.expiry} onChange={e => {
            let val = e.target.value.replace(/\D/g, '').slice(0, 4);
            if (val.length >= 3) val = val.slice(0, 2) + '/' + val.slice(2);
            setDefaultCard({ ...defaultCard, expiry: val });
          }} placeholder="MM/YY" />
          <label>CVV:</label>
          <input value={defaultCard.cvv} onChange={e => setDefaultCard({ ...defaultCard, cvv: e.target.value })} />
          <label>Card Holder Name:</label>
          <input value={defaultCard.name} onChange={e => setDefaultCard({ ...defaultCard, name: e.target.value })} />
          <label>Valid UPI ID:</label>
          <input value={defaultUPI} onChange={e => setDefaultUPI(e.target.value)} />
          <button onClick={savePaymentDefaults}>Save Payment Defaults</button>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="admin-section fade-in transaction-log">
          <h3>🧾 Transaction Logs</h3>
          <div className="filters">
            <input
              placeholder="Filter by user"
              value={filters.user}
              onChange={(e) => setFilters({ ...filters, user: e.target.value })}
            />
            <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
              <option value="">All Status</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </select>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            />
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : filteredTransactions.length === 0 ? (
            <p>No transactions match the filter.</p>
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
                {filteredTransactions.map(txn => (
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
      )}

      {/* Users Registration Tab */}
      {activeTab === 'users' && (
        <div className="admin-section fade-in">
          <h3>👥 Users Registration</h3>

          <div className="user-subtabs">
            <button className={userTab === 'new' ? 'active' : ''} onClick={() => setUserTab('new')}>New Registrations</button>
            <button className={userTab === 'declined' ? 'active' : ''} onClick={() => setUserTab('declined')}>Declined</button>
          </div>

          {userTab === 'new' && (
            pendingUsers.length === 0 ? (
              <p>No pending users.</p>
            ) : (
              <table>
                <thead>
                  <tr><th>Username</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {pendingUsers.map(user => (
                    <tr key={user._id}>
                      <td>{user.username}</td>
                      <td>
                        <button onClick={() => handleUserApproval(user.username, true)} style={{ color: 'green' }}>Approve</button>
                        <button onClick={() => handleUserApproval(user.username, false)} style={{ color: 'red', marginLeft: '10px' }}>Decline</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}

          {userTab === 'declined' && (
            declinedUsers.length === 0 ? (
              <p>No declined users.</p>
            ) : (
              <table>
                <thead>
                  <tr><th>Username</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {declinedUsers.map(user => (
                    <tr key={user._id}>
                      <td>{user.username}</td>
                      <td>
                        <button onClick={() => handleUserApproval(user.username, true)} style={{ color: 'green' }}>Approve</button>
                        <button onClick={() => handleUserApproval(user.username, false)} style={{ color: 'red', marginLeft: '10px' }}>Decline</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </div>
      )}
    </div>
  );
}