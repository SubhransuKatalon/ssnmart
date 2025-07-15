import { useState } from 'react';
import axios from 'axios';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        username,
        password
      });

      if (res.status === 200 && res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        alert('✅ Login successful');
        onLogin(); // e.g. update navbar or redirect
      } else {
        setError('❌ Login failed');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError('❌ Invalid username or password');
      } else if (err.response?.data.message === 'declined by admin.') {
        setError('❌ Admin has declined your registration. Contact admin@ssnmart.com');
      } else if (err.response?.data.message === 'pending approval by admin.') {
        setError('❌ Your account is pending approval by admin.');
      } else {
        setError('❌ Server error. Try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        /><br /><br />
        <input
          name="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        /><br /><br />
        <button name="login-button" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
}