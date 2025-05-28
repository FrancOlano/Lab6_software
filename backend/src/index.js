const express = require('express');
const app = express();
const port = 3001;
const AuthService = require('../services/AuthService');
const BookService = require('../services/BookService');
const ReservationService = require('../services/ReservationService');

const authService = new AuthService();
const bookService = new BookService();
const reservationService = new ReservationService(bookService);

app.use(express.json());

app.post('/register', (req, res) => {
  const { email } = req.body;
  const success = authService.registerUser(email);
  res.json({ success });
});

app.post('/books', (req, res) => {
  const { title, author } = req.body;
  const book = { title, author, available: true };
  bookService.addBook(book);
  res.status(201).json(book);
});

app.get('/books', (req, res) => {
  res.json(bookService.getBooks());
});

app.post('/reservations', (req, res) => {
  const { userId, bookId } = req.body;
  const success = bookService.reserveBook(bookId);
  if (success) {
    reservationService.createReservation({ userId, bookId, date: new Date() });
    res.status(201).json({ success: true });
  } else {
    res.status(400).json({ success: false, message: 'Book not available' });
  }
});

app.delete('/reservations/:id', (req, res) => {
  const success = reservationService.cancelReservation(req.params.id);
  res.json({ success });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
