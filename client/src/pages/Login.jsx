import { useState } from 'react';
import axios from 'axios';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('${import.meta.env.VITE_API_URL}/api/auth/login', {
        username,
        password
      });

      // ✅ Check if the response contains a user
      if (res.status === 200 && res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        alert('✅ Login successful');
        onLogin(); // trigger parent update (e.g. Navbar)
      } else {
        setError('❌ Login failed');
      }

    } catch (err) {
      if (err.response?.status === 401) {
        setError('❌ Invalid username or password');
      } else {
        setError('❌ Server error. Try again later.');
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          placeholder="Username" 
          required 
        /><br /><br />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password" 
          required 
        /><br /><br />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
