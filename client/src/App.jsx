import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Navbar from './components/Navbar';
import TopToolbar from './components/TopToolbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Payment from './pages/Payment';




function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate('/');
  };

  return (
    <div style={{ paddingBottom: '50px', textAlign: 'center' }}>   
      {/* 🔽 LOGO */}
      <img src="/favicon.png" alt="SSN Mart" height="60" />
      {/* 🔽 TOOLBAR WITH ICONS */}
      <TopToolbar />
      <hr />
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </div>
  );
}

export default App;