import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
      }

      setSuccessMessage('Signup successful! Redirecting to login...');
      setErrorMessage('');

      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Signup failed:', error);
      setErrorMessage(`Signup failed: ${error.message}`);
      setSuccessMessage('');
    }
  };

  return (
    <div>
      {successMessage && (
        <div style={{ backgroundColor: 'green', color: 'white', padding: '10px', position: 'fixed', top: 0, left: 0, right: 0, textAlign: 'center' }}>
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div style={{ backgroundColor: 'red', color: 'white', padding: '10px', position: 'fixed', top: 0, left: 0, right: 0, textAlign: 'center' }}>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSignup}>
        <h2>Signup</h2>
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
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default Signup;
