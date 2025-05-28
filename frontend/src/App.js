import React from 'react';
import './App.css';
import UserRegistration from './components/UserRegistration';
import BookCatalog from './components/BookCatalog';

function App() {
  return (
    <div className="App">
      <h1>Library Reservations App</h1>
      <UserRegistration />
      <BookCatalog />
    </div>
  );
}

export default App;
