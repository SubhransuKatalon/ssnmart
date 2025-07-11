import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import TopToolBar from './components/TopToolBar';
import PrivateRoute from './components/PrivateRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Payment from './pages/Payment';
import CategoryProducts from './pages/CategoryProducts';

// ✅ Admin route wrapper
function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || user.username !== 'admin') {
    window.location.href = '/login';
    return null;
  }
  return children;
}

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
      <img src="/logo.png" alt="SSN Mart" height="60" />
      {/* 🔽 Pass isAdmin to TopToolBar */}
      <TopToolBar onLogout={handleLogout} isAdmin={isLoggedIn && JSON.parse(localStorage.getItem('user'))?.username === 'admin'} />
      <hr />
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/category/:category" element={<CategoryProducts />} />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <PrivateRoute>
              <Payment />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;