import React, { useState, useEffect } from 'react';
import './BookCatalog.css';

function BookCatalog({ userId, isAdmin }) {
  const [books, setBooks] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastAction, setLastAction] = useState(null);
  useEffect(() => {
    fetchBooks();
    if (userId) {
      fetchUserReservations();
    } else {
      setReservations([]); // Clear reservations when user signs out
    }
  }, [userId]);

  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:3001/books');
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      setMessage('Error fetching books');
      setMessageType('error');
    }
  };

  const fetchUserReservations = async () => {
    if (!userId) return;
    
    try {
      const response = await fetch(`http://localhost:3001/reservations/user/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch reservations');
      }
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      setMessage('Error fetching reservations');
      setMessageType('error');
    }
  };

  const handleReserveBook = async (bookId) => {
    if (!userId) {
      setMessage('Please sign in to reserve books');
      setMessageType('error');
      return;
    }

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
        setMessageType('success');
        setLastAction({
          type: 'reserve',
          reservationId: data.id,
          bookId: bookId
        });
        await Promise.all([fetchBooks(), fetchUserReservations()]);
      } else {
        setMessage(data.message || 'Error reserving book');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Error during reservation');
      setMessageType('error');
    }
  };

  const handleCancelReservation = async (reservationId) => {
    try {
      const response = await fetch(`http://localhost:3001/reservations/${reservationId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setMessage('Reservation cancelled successfully!');
        setMessageType('success');
        setLastAction({
          type: 'cancel',
          reservationId: reservationId
        });
        await Promise.all([fetchBooks(), fetchUserReservations()]);
      } else {
        const data = await response.json();
        setMessage(data.message || 'Error cancelling reservation');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Error during cancellation');
      setMessageType('error');
    }
  };

  const handleUndoAction = async () => {
    if (!lastAction) return;

    try {
      if (lastAction.type === 'reserve') {
        await handleCancelReservation(lastAction.reservationId);
      } else if (lastAction.type === 'cancel') {
        await handleReserveBook(lastAction.bookId);
      }
      setLastAction(null);
    } catch (error) {
      setMessage('Error undoing last action');
      setMessageType('error');
    }
  };

  const clearMessage = () => {
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  useEffect(() => {
    if (message) {
      clearMessage();
    }
  }, [message]);

  return (
    <div className="book-catalog">
      <h2>Book Catalog</h2>
      
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Search books by title or author..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {message && (
        <div className={`message ${messageType}`}>
          {message}
          {lastAction && (
            <button onClick={handleUndoAction} className="undo-button">
              Undo
            </button>
          )}
        </div>
      )}
      
      <ul className="book-list">
        {books
          .filter(book => 
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map(book => {
            const reservation = reservations.find(r => r.bookId === book.id);
            const isReservedByUser = reservation !== undefined;
            
            return (
              <li key={book.id} className="book-item">
                <div className="book-info">
                  <h3>{book.title}</h3>
                  <p>By {book.author}</p>
                  <p className={`status ${book.available ? 'available' : 'reserved'}`}>
                    {book.available ? 'Available' : (isReservedByUser ? 'Reserved by you' : 'Reserved')}
                  </p>
                </div>
                <div className="book-actions">
                  {!isAdmin && (
                    book.available ? (
                      userId && (
                        <button 
                          onClick={() => handleReserveBook(book.id)}
                          className="reserve-button"
                        >
                          Reserve
                        </button>
                      )
                    ) : (
                      isReservedByUser && (
                        <button 
                          onClick={() => handleCancelReservation(reservation.id)}
                          className="cancel-button"
                        >
                          Cancel Reservation
                        </button>
                      )
                    )
                  )}
                </div>
              </li>
            );
        })}
      </ul>

      {books.length === 0 && (
        <p className="no-books">No books found</p>
      )}
    </div>
  );
}

export default BookCatalog;
