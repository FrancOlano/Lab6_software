import React, { useState } from 'react';
import UserRegistration from './components/UserRegistration';
import BookCatalog from './components/BookCatalog';
import './App.css';

function App() {
  const [bookIdToRemove, setBookIdToRemove] = useState('');

  const handleRemoveSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`/api/books/${bookIdToRemove}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      alert('Book removed successfully!');
      setBookIdToRemove('');
    } catch (error) {
      alert(`Error removing book: ${error.message}`);
    }
  };
  const [newBook, setNewBook] = useState({ title: '', author: '', available: true });

  const handleInputChange = (event) => {
    setNewBook({ ...newBook, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBook),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      alert('Book added successfully!');
      setNewBook({ title: '', author: '', available: true });
    } catch (error) {
      alert(`Error adding book: ${error.message}`);
    }
  };

  return (
    <div className="App">
      <h1>Library Reservations App</h1>
      <UserRegistration />
      <BookCatalog />
      <h2>Add New Book</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input type="text" name="title" value={newBook.title} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Author:
          <input type="text" name="author" value={newBook.author} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Available:
          <input type="checkbox" name="available" checked={newBook.available} onChange={(e) => setNewBook({ ...newBook, available: e.target.checked })} />
        </label>
        <br />
        <button type="submit">Add Book</button>
      </form>
      <h2>Remove Book</h2>
      <form onSubmit={handleRemoveSubmit}>
        <label>
          Book ID to remove:
          <input type="number" name="bookIdToRemove" value={bookIdToRemove} onChange={(e) => setBookIdToRemove(parseInt(e.target.value, 10))} />
        </label>
        <br />
        <button type="submit">Remove Book</button>
      </form>
    </div>
  );
}

export default App;
