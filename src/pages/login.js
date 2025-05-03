import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Hardcoded demo credentials
  const demoEmail = '123@gmail.com';
  const demoPassword = '123';

  // Initialize useNavigate hook
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation for demo login
    if (email === demoEmail && password === demoPassword) {
      alert(`Logged in successfully with:\nEmail: ${email}\nPassword: ${password}`);
      // Redirect to dashboard
      navigate('/dashboard');
    } else if (!email || !password) {
      setError('Please fill in both email and password.');
    } else {
      setError('Incorrect email or password.');
    }
  };

  return (
    <div className="login-wrapper">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">Login</h2>

        {error && <p className="error-message">{error}</p>}

        <div className="login-input-group">
          <label className="login-label">Email</label>
          <input
            type="email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>

        <div className="login-input-group">
          <label className="login-label">Password</label>
          <input
            type="password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
