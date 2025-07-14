import { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('product');

  // Product form
  const [form, setForm] = useState({ name: '', price: '', image: '', description: '', category: 'Electronics' });
  const [specInput, setSpecInput] = useState('');
  const [specifications, setSpecifications] = useState([]);

  // Payment config
  const [defaultCard, setDefaultCard] = useState({ name: '', number: '', expiry: '', cvv: '' });
  const [defaultUPI, setDefaultUPI] = useState('');

  // Transaction logs
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [page, setPage] = useState(1);

  const categories = ['Electronics', 'Fashion', 'Home & Furniture', 'Beauty & Personal care', 'Grocery'];
  const perPage = 10;

  useEffect(() => {
    if (activeTab === 'transactions') {
      setLoading(true);
      axios.get(`${import.meta.env.VITE_API_URL}/api/transactions`)
        .then(res => {
          const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setTransactions(sorted);
        })
        .catch(err => console.error('Failed to fetch transactions:', err))
        .finally(() => setLoading(false));
    }
  }, [activeTab]);

  useEffect(() => {
    let filteredList = transactions;
    if (statusFilter) filteredList = filteredList.filter(txn => txn.status === statusFilter);
    if (userFilter) filteredList = filteredList.filter(txn => txn.user?.toLowerCase().includes(userFilter.toLowerCase()));
    if (dateFilter) filteredList = filteredList.filter(txn =>
      new Date(txn.createdAt).toISOString().split('T')[0] === dateFilter
    );
    setFiltered(filteredList);
    setPage(1); // Reset page on filter change
  }, [statusFilter, userFilter, dateFilter, transactions]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addSpec = () => {
    if (specInput.trim()) {
      setSpecifications([...specifications, specInput.trim()]);
      setSpecInput('');
    }
  };

  const removeSpec = (index) => setSpecifications(specifications.filter((_, i) => i !== index));

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${import.meta.env.VITE_API_URL}/api/products`, {
      ...form, price: Number(form.price), specifications
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

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>

      <div className="admin-tabs">
        <button className={activeTab === 'product' ? 'active' : ''} onClick={() => setActiveTab('product')}>Add Product</button>
        <button className={activeTab === 'payment' ? 'active' : ''} onClick={() => setActiveTab('payment')}>Payment Config</button>
        <button className={activeTab === 'transactions' ? 'active' : ''} onClick={() => setActiveTab('transactions')}>Transaction Logs</button>
      </div>

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
              <input placeholder="Add Specification" value={specInput} onChange={(e) => setSpecInput(e.target.value)} />
              <button type="button" className="add-spec-btn" onClick={addSpec}>Add Spec {specifications.length + 1}</button>
            </div>
            <ul className="spec-list">
              {specifications.map((spec, idx) => (
                <li key={idx}>{spec}
                  <button type="button" className="remove-spec-btn" onClick={() => removeSpec(idx)}>❌</button>
                </li>
              ))}
            </ul>
            <button type="submit">Add Product</button>
          </form>
        </div>
      )}

      {activeTab === 'payment' && (
        <div className="admin-section fade-in payment-defaults">
          <label>Card Number:</label>
          <input value={defaultCard.number}
            onChange={e => {
              const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
              const formatted = raw.replace(/(.{4})/g, '$1-').replace(/-$/, '');
              setDefaultCard({ ...defaultCard, number: formatted });
            }}
            placeholder="1234-5678-9012-3456"
          />
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

      {activeTab === 'transactions' && (
        <div className="admin-section fade-in transaction-log">
          {loading ? <p>Loading...</p> : (
            <>
              <div className="filters">
                <input placeholder="Search by user" value={userFilter} onChange={e => setUserFilter(e.target.value)} />
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                  <option value="">All Status</option>
                  <option value="success">✅ Success</option>
                  <option value="failed">❌ Failed</option>
                </select>
                <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
              </div>

              {filtered.length === 0 ? (
                <p>No matching transactions.</p>
              ) : (
                <>
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
                      {paginated.map(txn => (
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

                  <div className="pagination">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button key={i + 1} onClick={() => setPage(i + 1)} className={page === i + 1 ? 'active' : ''}>
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}