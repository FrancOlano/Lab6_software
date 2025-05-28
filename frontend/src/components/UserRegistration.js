import React from 'react';
import './UserRegistration.css';

function UserRegistration() {
  return (
    <div className="user-registration">
      <h2>User Registration</h2>
      <form>
        <input type="email" placeholder="Email" />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default UserRegistration;
