import React, { useState } from 'react';
import './LoginForm.css';

function LoginForm({ onLogin, onCancel }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setMessage('Login successful!');
        setMessageType('success');
        if (onLogin) onLogin(data.user);
      } else {
        setMessage(data.message || 'Login failed');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Error during login. Please try again.');
      setMessageType('error');
    }
  };

  return (
    <div className="login-form">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="button-group">
          <button type="submit">Sign In</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
      {message && (
        <div className={`message ${messageType}`}>{message}</div>
      )}
    </div>
  );
}

export default LoginForm;
