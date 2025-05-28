import React from 'react';
import './BookCatalog.css';

function BookCatalog() {
  return (
    <div className="book-catalog">
      <h2>Book Catalog</h2>
      <div className="search-bar">
        <input type="text" placeholder="Search books..." />
      </div>
      <ul className="book-list">
        <li className="book-item">Book 1 <button>Reserve</button></li>
        <li className="book-item">Book 2 <button>Reserve</button></li>
      </ul>
    </div>
  );
}

export default BookCatalog;
