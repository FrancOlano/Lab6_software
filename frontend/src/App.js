import React from 'react';
import UserRegistration from './components/UserRegistration';
import BookCatalog from './components/BookCatalog';
import MyReservations from './components/MyReservations';
import './App.css';

function App() {
  const userId = "user1"; // Replace with actual logged-in user logic
  return (
    <div className="App">
      <h1>Library Reservations App</h1>
      <UserRegistration />
      <BookCatalog />
      <MyReservations userId={userId} />
    </div>
  );
}

export default App;
