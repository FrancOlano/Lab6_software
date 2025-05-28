import React, { useState } from 'react';
import './BookManagement.css';

function BookManagement({ onBookAdded, onBookRemoved }) {
  const [newBook, setNewBook] = useState({ title: '', author: '', available: true });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [lastAddedBook, setLastAddedBook] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewBook(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBook),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setMessage('Book added successfully!');
        setMessageType('success');
        setLastAddedBook(data.book);
        setNewBook({ title: '', author: '', available: true });
        if (onBookAdded) onBookAdded(data.book);
      } else {
        setMessage(data.message || 'Failed to add book');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error adding book:', error);
      setMessage('Error connecting to the server. Please try again.');
      setMessageType('error');
    }
  };

  const handleUndoAdd = async () => {
    if (!lastAddedBook) return;

    try {
      const response = await fetch(`http://localhost:3001/books/${lastAddedBook.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setMessage('Book addition undone successfully');
        setMessageType('success');
        setLastAddedBook(null);
        if (onBookRemoved) onBookRemoved(lastAddedBook.id);
      } else {
        const data = await response.json();
        setMessage(data.message || 'Failed to undo');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Error undoing book addition');
      setMessageType('error');
    }
  };

  return (
    <div className="book-management">
      <form onSubmit={handleAddBook} className="add-book-form">
        <h3>Add New Book</h3>
        <div className="form-group">
          <input
            type="text"
            name="title"
            placeholder="Book Title"
            value={newBook.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="author"
            placeholder="Author"
            value={newBook.author}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="available"
              checked={newBook.available}
              onChange={handleInputChange}
            />
            Available for reservation
          </label>
        </div>
        <div className="button-group">
          <button type="submit">Add Book</button>
          {lastAddedBook && (
            <button type="button" onClick={handleUndoAdd}>
              Undo Add
            </button>
          )}
        </div>
      </form>

      {message && (
        <div className={`message ${messageType}`}>{message}</div>
      )}
    </div>
  );
}

export default BookManagement;
