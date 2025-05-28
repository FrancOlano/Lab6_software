import React from 'react';
import UserRegistration from './components/UserRegistration';
import BookCatalog from './components/BookCatalog';
import './App.css';

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
