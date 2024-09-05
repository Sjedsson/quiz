import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { post } from '../Services/api';
import { setToken } from '../Services/auth';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {

      const response = await fetch('https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      setToken(data.token);
      setErrorMessage('');

      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage(`Login failed: ${error.message}`);
    }
  };

  return (
    <div>
      {errorMessage && (
        <div style={{ backgroundColor: 'red', color: 'white', padding: '10px', position: 'fixed', top: 0, left: 0, right: 0, textAlign: 'center' }}>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
