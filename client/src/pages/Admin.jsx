import { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('product');
  const [userSubTab, setUserSubTab] = useState('new');
  const [form, setForm] = useState({
    name: '', price: '', image: '', description: '', category: 'Electronics',
    featured: false, bestseller: false
  });
  const [specInput, setSpecInput] = useState('');
  const [specifications, setSpecifications] = useState([]);
  const [defaultCard, setDefaultCard] = useState({ name: '', number: '', expiry: '', cvv: '' });
  const [defaultUPI, setDefaultUPI] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({ status: '', user: '', date: '' });
  const [pagination, setPagination] = useState({ currentPage: 1, perPage: 10 });
  const [loading, setLoading] = useState(false);
  const [newUsers, setNewUsers] = useState([]);
  const [declinedUsers, setDeclinedUsers] = useState([]);

  const categories = ['Electronics', 'Fashion', 'Home & Furniture', 'Beauty & Personal care', 'Grocery'];

  useEffect(() => {
    if (activeTab === 'transactions') {
      setLoading(true);
      axios.get(`${import.meta.env.VITE_API_URL}/api/transactions`)
        .then(res => setTransactions(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }

    if (activeTab === 'users') {
      axios.get(`${import.meta.env.VITE_API_URL}/api/users/pending`)
        .then(res => {
          setNewUsers(res.data.newUsers);
          setDeclinedUsers(res.data.declinedUsers);
        })
        .catch(console.error);
    }
  }, [activeTab]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addSpec = () => {
    if (specInput.trim()) {
      setSpecifications([...specifications, specInput.trim()]);
      setSpecInput('');
    }
  };

  const removeSpec = index => setSpecifications(specifications.filter((_, i) => i !== index));

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, {
        ...form,
        price: Number(form.price),
        specifications
      });
      alert('✅ Product added!');
      setForm({ name: '', price: '', image: '', description: '', category: 'Electronics', featured: false, bestseller: false });
      setSpecifications([]);
    } catch {
      alert('❌ Failed to add product');
    }
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
        setNewUsers(prev => prev.filter(u => u.username !== username));
        setDeclinedUsers(prev => prev.filter(u => u.username !== username));
      })
      .catch(() => alert('❌ Failed to update user status.'));
  };

  const handleUserDelete = (username) => {
    if (!window.confirm(`Delete user "${username}" permanently?`)) return;
    axios.delete(`${import.meta.env.VITE_API_URL}/api/users/${username}`)
      .then(() => {
        alert('User deleted!');
        setDeclinedUsers(prev => prev.filter(u => u.username !== username));
      })
      .catch(() => alert('❌ Failed to delete user.'));
  };

  const filteredTransactions = transactions
    .filter(txn =>
      (!filters.status || txn.status === filters.status) &&
      (!filters.user || txn.user?.toLowerCase().includes(filters.user.toLowerCase())) &&
      (!filters.date || new Date(txn.createdAt).toISOString().slice(0, 10) === filters.date)
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const totalPages = Math.ceil(filteredTransactions.length / pagination.perPage);
  const currentPageData = filteredTransactions.slice(
    (pagination.currentPage - 1) * pagination.perPage,
    pagination.currentPage * pagination.perPage
  );

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>

      <div className="admin-tabs">
        {['product', 'payment', 'transactions', 'users'].map(tab => (
          <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>
            {tab === 'product' ? 'Add Product' : tab === 'payment' ? 'Payment Config' : tab === 'transactions' ? 'Transaction Logs' : 'Users Registration'}
          </button>
        ))}
      </div>

      {activeTab === 'product' && (
        <div className="admin-section fade-in">
          <h3 className="section-title">➕ Add New Product</h3>
          <form onSubmit={handleSubmit}>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
            <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price" required />
            <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" required />
            <input name="description" value={form.description} onChange={handleChange} placeholder="Description" required />
            <select name="category" value={form.category} onChange={handleChange}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>

            {/* ✅ Checkboxes */}
            <div className="checkbox-row">
              <label><input type="checkbox" name="featured" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} /> ✅ Featured</label>
              <label><input type="checkbox" name="bestseller" checked={form.bestseller} onChange={e => setForm({ ...form, bestseller: e.target.checked })} /> 🔥 Bestseller</label>
            </div>

            <div className="spec-section">
              <input type="text" placeholder="Add Specification" value={specInput} onChange={e => setSpecInput(e.target.value)} />
              <button type="button" className="add-spec-btn" onClick={addSpec}>Add Spec {specifications.length + 1}</button>
            </div>

            <ul className="spec-list">
              {specifications.map((s, i) => (
                <li key={i}>{s}
                  <button type="button" className="remove-spec-btn" onClick={() => removeSpec(i)}>❌</button>
                </li>
              ))}
            </ul>

            <button type="submit">Add Product</button>
          </form>
        </div>
      )}

      {activeTab === 'payment' && (
        <div className="admin-section fade-in payment-defaults">
          <h3 className="section-title">💳 Payment Configuration</h3>
          {['number', 'expiry', 'cvv', 'name'].map(field => (
            <>
              <label>{field === 'number' ? 'Card Number' : field === 'expiry' ? 'Expiry (MM/YY)' : field === 'cvv' ? 'CVV' : 'Card Holder Name'}</label>
              <input
                value={defaultCard[field]}
                onChange={e => {
                  let val = e.target.value.replace(/\D/g, '');
                  if (field === 'number') val = val.slice(0, 16).replace(/(.{4})/g, '$1-').replace(/-$/, '');
                  if (field === 'expiry') {
                    val = val.slice(0, 4);
                    if (val.length >= 3) val = val.slice(0, 2) + '/' + val.slice(2);
                  }
                  setDefaultCard({ ...defaultCard, [field]: val });
                }}
                placeholder={field === 'number' ? '1234-5678-9012-3456' : field === 'expiry' ? 'MM/YY' : ''}
              />
            </>
          ))}
          <label>Valid UPI ID:</label>
          <input value={defaultUPI} onChange={e => setDefaultUPI(e.target.value)} />
          <button onClick={savePaymentDefaults}>Save Payment Defaults</button>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="admin-section fade-in transaction-log">
          <h3>🧾 Transaction Logs</h3>
          <div className="filters">
            <input placeholder="Filter by user" value={filters.user} onChange={e => setFilters({ ...filters, user: e.target.value })} />
            <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}>
              <option value="">All Status</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </select>
            <input type="date" value={filters.date} onChange={e => setFilters({ ...filters, date: e.target.value })} />
          </div>

          {loading ? (
              <p className="loading-message">Loading...</p>
            ) : currentPageData.length === 0 ? (
              <p className="no-results-message">🚫 No transactions found for the selected filters.</p>
            ) : (
              <>
                <table>
                  <thead>
                    <tr><th>User</th><th>Method</th><th>Status</th><th>Amount</th><th>Date</th></tr>
                  </thead>
                  <tbody>
                    {currentPageData.map(txn => (
                      <tr key={txn._id}>
                        <td>{txn.user || 'Anonymous'}</td>
                        <td>{txn.method}</td>
                        <td style={{ color: txn.status === 'success' ? 'green' : 'red' }}>{txn.status}</td>
                        <td>₹{txn.amount}</td>
                        <td>{new Date(txn.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="pagination">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      className={pagination.currentPage === i + 1 ? 'active' : ''}
                      onClick={() => setPagination({ ...pagination, currentPage: i + 1 })}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </>
            )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="admin-section fade-in transaction-log">
          <h3>👥 Users Registration</h3>
          <div className="admin-tabs">
            <button className={userSubTab === 'new' ? 'active' : ''} onClick={() => setUserSubTab('new')}>New Registrations</button>
            <button className={userSubTab === 'declined' ? 'active' : ''} onClick={() => setUserSubTab('declined')}>Declined</button>
          </div>

          {userSubTab === 'new' ? (
            newUsers.length === 0 ? <p>No new registrations.</p> : (
              <table>
                <thead><tr><th>Username</th><th>Action</th></tr></thead>
                <tbody>
                  {newUsers.map(user => (
                    <tr key={user._id}>
                      <td>{user.username}</td>
                      <td>
                        <button className="approve-btn" onClick={() => handleUserApproval(user.username, true)}>Approve</button>
                        <button className="decline-btn" onClick={() => handleUserApproval(user.username, false)}>Decline</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : (
            declinedUsers.length === 0 ? <p>No declined users.</p> : (
              <table>
                <thead><tr><th>Username</th><th>Action</th></tr></thead>
                <tbody>
                  {declinedUsers.map(user => (
                    <tr key={user._id}>
                      <td>{user.username}</td>
                      <td>
                        <button className="approve-btn" onClick={() => handleUserApproval(user.username, true)}>Approve</button>
                        <button className="delete-btn" onClick={() => handleUserDelete(user.username)}>Delete</button>
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