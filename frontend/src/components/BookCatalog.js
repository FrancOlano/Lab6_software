import React, { useState, useEffect } from 'react';
import './BookCatalog.css';

function BookCatalog({ userId, isAdmin }) {
  const [books, setBooks] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBooks();
    if (userId) {
      fetchUserReservations();
    }
  }, [userId]);

  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:3001/books');
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      setMessage('Error fetching books.');
    }
  };

  const fetchUserReservations = async () => {
    try {
      const response = await fetch(`http://localhost:3001/reservations/user/${userId}`);
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      setMessage('Error fetching reservations.');
    }
  };

  const handleReserveBook = async (bookId) => {
    try {
      const response = await fetch('http://localhost:3001/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, bookId })
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Book reserved successfully!');
        fetchBooks();
        fetchUserReservations();
      } else {
        setMessage(data.message || 'Error reserving book.');
      }
    } catch (error) {
      setMessage('Error during reservation.');
    }
  };

  const handleCancelReservation = async (reservationId) => {
    try {
      const response = await fetch(`http://localhost:3001/reservations/${reservationId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setMessage('Reservation cancelled successfully!');
        fetchBooks();
        fetchUserReservations();
      } else {
        setMessage('Error cancelling reservation.');
      }
    } catch (error) {
      setMessage('Error during cancellation.');
    }
  };

  return (
    <div className="book-catalog">
      <h2>Book Catalog</h2>
      
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Search books..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {message && <div className="message">{message}</div>}
      
      <ul className="book-list">
        {books
          .filter(book => 
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map(book => {
            const reservation = reservations.find(r => r.bookId === book.id);
            return (
              <li key={book.id} className="book-item">
                <div className="book-info">
                  <h3>{book.title}</h3>
                  <p>By {book.author}</p>
                  <p>Status: {book.available ? 'Available' : 'Reserved'}</p>
                </div>
                <div className="book-actions">
                  {book.available ? (
                    userId && <button onClick={() => handleReserveBook(book.id)}>Reserve</button>
                  ) : (
                    reservation && (
                      <button onClick={() => handleCancelReservation(reservation.id)}>
                        Cancel Reservation
                      </button>
                    )
                  )}
                </div>
              </li>
            );
        })}
      </ul>
    </div>
  );
}

export default BookCatalog;
