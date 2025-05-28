import React, { useState, useEffect } from 'react';
import UserRegistration from './components/UserRegistration';
import BookCatalog from './components/BookCatalog';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState('');
  const [newBook, setNewBook] = useState({ title: '', author: '', available: true });
  const [bookIdToRemove, setBookIdToRemove] = useState('');
  const [lastAddedBook, setLastAddedBook] = useState(null);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      setIsAdmin(user.role === 'admin');
    }
  }, []);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setNewBook({ 
      ...newBook, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isAdmin) {
      setMessage('Only administrators can add books');
      return;
    }
    try {
      const response = await fetch('http://localhost:3001/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBook),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage('Book added successfully!');
        setLastAddedBook(data);
        setNewBook({ title: '', author: '', available: true });
      } else {
        const error = await response.json();
        setMessage(error.message || 'Error adding book');
      }
    } catch (error) {
      setMessage('Error adding book');
    }
  };

  const handleRemoveSubmit = async (event) => {
    event.preventDefault();
    if (!isAdmin) {
      setMessage('Only administrators can remove books');
      return;
    }
    try {
      const response = await fetch(`http://localhost:3001/books/${bookIdToRemove}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setMessage('Book removed successfully!');
        setBookIdToRemove('');
      } else {
        const error = await response.json();
        setMessage(error.message || 'Error removing book');
      }
    } catch (error) {
      setMessage('Error removing book');
    }
  };

  const handleUndoAddBook = async () => {
    if (!lastAddedBook || !isAdmin) return;
    
    try {
      const response = await fetch(`http://localhost:3001/books/${lastAddedBook.id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setMessage('Book addition undone successfully!');
        setLastAddedBook(null);
      } else {
        const error = await response.json();
        setMessage(error.message || 'Error undoing book addition');
      }
    } catch (error) {
      setMessage('Error undoing book addition');
    }
  };

  return (
    <div className="App">
      <h1>Library Reservations App</h1>
      {message && <div className="message">{message}</div>}
      
      <UserRegistration onUserRegister={setCurrentUser} />
      
      <BookCatalog userId={currentUser?.id} isAdmin={isAdmin} />
      
      {isAdmin && (
        <div className="admin-section">
          <h2>Book Management</h2>
          <form onSubmit={handleSubmit} className="add-book-form">
            <h3>Add New Book</h3>
            <input
              type="text"
              name="title"
              placeholder="Book Title"
              value={newBook.title}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="author"
              placeholder="Author"
              value={newBook.author}
              onChange={handleInputChange}
              required
            />
            <label>
              Available:
              <input
                type="checkbox"
                name="available"
                checked={newBook.available}
                onChange={handleInputChange}
              />
            </label>
            <button type="submit">Add Book</button>
            {lastAddedBook && (
              <button type="button" onClick={handleUndoAddBook}>
                Undo Add Book
              </button>
            )}
          </form>

          <form onSubmit={handleRemoveSubmit} className="remove-book-form">
            <h3>Remove Book</h3>
            <input
              type="number"
              placeholder="Book ID"
              value={bookIdToRemove}
              onChange={(e) => setBookIdToRemove(e.target.value)}
              required
            />
            <button type="submit">Remove Book</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
