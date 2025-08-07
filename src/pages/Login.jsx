import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Login.css';

const LoginPage = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);
  const passwordInputRef = useRef(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch('https://def-e-library-server.onrender.com/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
      navigate('/crud');
    } else {
      setErrorMessage('Wrong password');
      setShake(true);
      setTimeout(() => setShake(false), 500); // Remove shake after animation
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-container">
        <img src="./deff.jpeg" alt="Logo" className="login-logo" />
        <form onSubmit={handleLogin} className="login-form">
          <div className="login-input">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="login-input">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                ref={passwordInputRef}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={shake ? 'shake' : ''}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  // Eye open SVG
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 4C5 4 1.73 8.11 1.73 10C1.73 11.89 5 16 10 16C15 16 18.27 11.89 18.27 10C18.27 8.11 15 4 10 4ZM10 14C7.24 14 5 11.76 5 9C5 6.24 7.24 4 10 4C12.76 4 15 6.24 15 9C15 11.76 12.76 14 10 14ZM10 6C8.34 6 7 7.34 7 9C7 10.66 8.34 12 10 12C11.66 12 13 10.66 13 9C13 7.34 11.66 6 10 6Z" fill="#888"/>
                  </svg>
                ) : (
                  // Eye closed SVG
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M1 1L19 19M10 4C5 4 1.73 8.11 1.73 10C1.73 11.89 5 16 10 16C12.03 16 13.87 15.36 15.32 14.32M17.27 12.27C18.27 11.11 18.27 10 18.27 10C18.27 8.11 15 4 10 4M7.5 7.5C7.18 7.82 7 8.28 7 9C7 10.66 8.34 12 10 12C10.72 12 11.18 11.82 11.5 11.5" stroke="#888" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
