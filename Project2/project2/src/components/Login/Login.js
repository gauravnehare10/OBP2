import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import useStore from '../../store';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const {updateUserData} = useStore();

  const navigate = useNavigate()
  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === '' || password === '') {
      setError('Please fill in both fields');
      return;
    }

    setError('');
    axios.post('https://fastapi-app-2-c27y.onrender.com/login', {
      username: username,
      password: password
    })
    .then((response) => {
      console.log('Login successful:', response.data);
      setSuccess('Logged in Successfully.');
      const { access_token, user_details } = response.data;
      localStorage.setItem("token", access_token);
      updateUserData(user_details);
      console.log("Login successful:", user_details);
      localStorage.setItem("username", username);
      navigate("/");
    })
    .catch((error) => {
      console.error('Login error:', error);
      setError('Invalid username or password. Please try again.');
    });
  };
  return (
    <div className='login-main'>
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        {error && <p className="error-message">{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
              required
            />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
    </div>
    </div>
  );
};

export default Login;
