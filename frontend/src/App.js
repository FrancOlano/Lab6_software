import React, { useState, useEffect } from 'react';
import UserRegistration from './components/UserRegistration';
import BookCatalog from './components/BookCatalog';
import LoginForm from './components/LoginForm';
import BookManagement from './components/BookManagement';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [userReservations, setUserReservations] = useState([]);
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
      <header className="App-header">
        <h1>Library Reservation System</h1>
        <nav>
          {!currentUser ? (
            <>
              <button onClick={() => { setShowLogin(true); setShowRegister(false); }}>
                Sign In
              </button>
              <button onClick={() => { setShowRegister(true); setShowLogin(false); }}>
                Register
              </button>
            </>
          ) : (
            <>
              <span>Welcome, {currentUser.email}</span>
              <button onClick={() => {
                setCurrentUser(null);
                setIsAdmin(false);
                setShowLogin(false);
                setShowRegister(false);
              }}>Sign Out</button>
            </>
          )}
        </nav>
      </header>

      {message && <div className="message">{message}</div>}
      
      {showRegister && !currentUser && (
        <UserRegistration 
          onUserRegister={(user) => {
            setCurrentUser(user);
            setIsAdmin(user.role === 'admin');
            setShowRegister(false);
          }}
          onCancel={() => setShowRegister(false)}
        />
      )}

      {showLogin && !currentUser && (
        <LoginForm 
          onLogin={(user) => {
            setCurrentUser(user);
            setIsAdmin(user.role === 'admin');
            setShowLogin(false);
          }}
          onCancel={() => setShowLogin(false)}
        />
      )}

      {isAdmin ? (
        <div className="admin-section">
          <h2>Book Management</h2>
          <BookManagement 
            onBookAdded={() => setMessage('Book added successfully')}
            onBookRemoved={() => setMessage('Book removed successfully')}
          />
        </div>
      ) : (
        <div className="user-section">
          <BookCatalog 
            userId={currentUser?.id}
            onReserve={(bookId) => {
              if (!currentUser) {
                setMessage('Please sign in to reserve books');
                setShowLogin(true);
                return;
              }
              // Handle reservation
            }}
          />
          
          {currentUser && userReservations.length > 0 && (
            <div className="my-reservations">
              <h2>My Reserved Books</h2>
              <ul>
                {userReservations.map(reservation => (
                  <li key={reservation.id}>
                    {reservation.book.title}
                    <button onClick={() => handleCancelReservation(reservation.id)}>
                      Cancel Reservation
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
