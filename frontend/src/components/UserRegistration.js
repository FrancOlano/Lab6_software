import React, { useState } from 'react';
import './UserRegistration.css';

function UserRegistration({ onUserRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [registeredId, setRegisteredId] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      setMessageType('error');
      return;
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters long');
      setMessageType('error');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });      const data = await response.json();
      if (response.ok && data.success) {
        setMessage('Registration successful! You can now log in.');
        setMessageType('success');
        setRegisteredId(data.user.id);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        if (onUserRegister) {
          onUserRegister(data.user);
        }
      } else {
        setMessage(data.message || 'Registration failed.');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Error during registration. Please try again.');
      setMessageType('error');
    }
  };

  const handleUndo = async () => {
    if (!registeredId) return;
    
    try {
      const response = await fetch(`http://localhost:3001/register/${registeredId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('Registration undone successfully.');
        setRegisteredId(null);
      } else {
        setMessage('Failed to undo registration.');
      }
    } catch (error) {
      setMessage('Error during undo.');
    }
  };

  return (
    <div className="user-registration">
      <h2>User Registration</h2>      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={messageType === 'error' ? 'error' : ''}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={messageType === 'error' ? 'error' : ''}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className={messageType === 'error' ? 'error' : ''}
        />
        <button type="submit">Sign Up</button>
      </form>
      {registeredId && (
        <button onClick={handleUndo} className="undo-button">
          Undo Registration
        </button>
      )}
      {message && <div className="message">{message}</div>}
    </div>
  );
}

export default UserRegistration;
