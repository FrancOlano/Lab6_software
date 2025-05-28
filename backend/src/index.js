const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;
const AuthService = require('../services/AuthService');
const BookService = require('../services/BookService');
const ReservationService = require('../services/ReservationService');

const authService = new AuthService();
const bookService = new BookService();

// Middleware
app.use(cors());
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'An internal server error occurred.' 
  });
});

app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await authService.registerUser(email, password);
    res.status(201).json({
      success: true,
      user: {
        id: result.userId,
        email: result.email,
        role: result.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Registration failed'
    });
  }
});

app.delete('/register/:userId', async (req, res) => {
  try {
    await authService.unregisterUser(req.params.userId);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.post('/books', async (req, res) => {
  const { title, author, available } = req.body;
  if (!title || !author) {
    res.status(400).json({ 
      success: false, 
      message: 'Title and author are required' 
    });
    return;
  }

  try {
    const book = { title, author, available: available !== false };
    const newBook = await BookService.addBook(book);
    res.status(201).json({
      success: true,
      book: newBook
    });
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to add book' 
    });
  }
});

app.delete('/books/:id', async (req, res) => {
  const bookId = req.params.id;
  try {
    const result = await BookService.undoAddBook(bookId);
    res.json({ 
      success: true, 
      message: 'Book removed successfully',
      book: result.book
    });
  } catch (error) {
    console.error("Error removing book:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to remove book' 
    });
  }
});

app.get('/books', async (req, res) => {
  try {
    const books = await BookService.getBooks();
    res.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to fetch books' 
    });
  }
});

app.post('/reservations', async (req, res) => {
  const { userId, bookId } = req.body;
  try {
    const reservation = await ReservationService.reserveBook(userId, bookId);
    res.status(201).json(reservation);
  } catch (error) {
    console.error('Reservation error:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Failed to reserve book'
    });
  }
});

app.delete('/reservations/:id', async (req, res) => {
  try {
    const success = await ReservationService.cancelReservation(req.params.id);
    res.json({ success });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.get('/reservations/user/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
      throw new Error('Invalid user ID');
    }
    const reservations = await ReservationService.getUserReservations(userId);
    res.json(reservations || []);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Failed to fetch reservations'
    });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await authService.loginUser(email, password);
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ 
      success: false, 
      message: error.message || 'Invalid credentials'
    });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
