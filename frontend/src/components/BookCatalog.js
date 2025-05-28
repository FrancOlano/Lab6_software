import React, { useState, useEffect } from 'react';
import './BookCatalog.css';

function BookCatalog() {
  const [books, setBooks] = useState([]);
  const userId = '12345'; // Hardcoded user ID for now

  useEffect(() => {
    fetch('http://localhost:3001/books')
      .then(response => response.json())
      .then(data => setBooks(data));
  }, []);

  const handleReserveBook = (bookId) => {
    fetch('http://localhost:3001/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: userId, bookId: bookId })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Book reserved successfully!');
        } else {
          alert('Error reserving book: ' + data.message);
        }
      });
  };

  return (
    <div className="book-catalog">
      <h2>Book Catalog</h2>
      <div className="search-bar">
        <input type="text" placeholder="Search books..." />
      </div>
      <ul className="book-list">
        {books.map(book => (
          <li className="book-item" key={book.isbn}>
            {book.title} by {book.author}
            <button onClick={() => handleReserveBook(book._id)}>Reserve</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BookCatalog;
