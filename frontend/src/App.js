import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Users from './components/Users';
import UserDetail from './components/UserDetail';
import CreateUser from './components/CreateUser';
import UpdateUser from './components/UpdateUser';
import './App.css';
import { Navigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple authentication - in real app, this would be API call
    if (username === 'admin' && password === 'admin') {
      onLogin(true);
      navigate('/');
    } else {
      setError('Invalid credentials. Try admin/password');
    }
  };

  return (
    <div className="page-card login-container">
      <h2>Login to Your Account</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
}

function Navbar({ isAuthenticated, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-header">
          <h2 className="logo">Go API Frontend</h2>
          {isAuthenticated && (
            <button 
              className={`hamburger ${isMenuOpen ? 'open' : ''}`} 
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          )}
        </div>
        
        {isAuthenticated && (
          <ul className={`nav-links ${isMenuOpen ? 'show' : ''}`}>
            <li>
              <Link 
                to="/" 
                onClick={closeMenu}
                className={isActive('/') ? 'active' : ''}
              >
                Users
              </Link>
            </li>
            <li>
              <Link 
                to="/create" 
                onClick={closeMenu}
                className={isActive('/create') ? 'active' : ''}
              >
                Create
              </Link>
            </li>
            <li>
              <Link 
                to="/update" 
                onClick={closeMenu}
                className={isActive('/update') ? 'active' : ''}
              >
                Update
              </Link>
            </li>
            <li>
              <Link 
                to="/user" 
                onClick={closeMenu}
                className={isActive('/user') ? 'active' : ''}
              >
                User Detail
              </Link>
            </li>
            <li>
              <button className="logout-btn" onClick={() => { onLogout(); closeMenu(); }}>
                Logout
              </button>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}

function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (status) => {
    setIsAuthenticated(status);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <div className="app-container">
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Users />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <CreateUser />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/update" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <UpdateUser />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/user" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <UserDetail />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </div>
  );
}

// Wrap App with Router
export default function Root() {
  return (
    <Router>
      <App />
    </Router>
  );
}