/*import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); 

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3005/login', {
        email,
        password,
      }, { withCredentials: true });

      setMessage(response.data.message);  
      navigate('/home');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <p>{message}</p>
    </div>
  );
}

export default Login;
*/

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useEffect } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth() 

  useEffect(() => {
    if (isAuthenticated) {
      // If the user is already authenticated, redirect to Home page
      navigate('/home');
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3005/login', {
        email,
        password,
      }, { withCredentials: true });

      setMessage(response.data.message);  
      if (response.data.message === 'Logged in successfully') {
        // Redirect to home after successful login
        navigate('/home');
      }
      navigate('/home');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="login-input email-input"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="login-input password-input"
      />
      <button onClick={handleLogin} className="login-button">Login</button>
      <p className="login-message">{message}</p>
    </div>
  );
}

export default Login;
