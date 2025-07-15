import { useState } from 'react';
import axios from 'axios';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        username,
        password,
      });

      setMessage('✅ Registration successful. Reach out to Admin for approval.');
    } catch (err) {
      if (err.response?.status === 409) {
        setError('❌ User already exists. Please choose a different username.');
      } else {
        setError('❌ Registration failed. Please try again.');
      }
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          name="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        /><br /><br />
        <input
          name="Password"
          type="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        /><br /><br />
        <button type="submit">Register</button>
      </form>

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
