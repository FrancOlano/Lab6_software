const express = require('express');
const app = express();
const port = 3001;
const AuthService = require('../services/AuthService');
const BookService = require('../services/BookService');
const reservationService = require('../services/ReservationService');

const authService = new AuthService();
const bookService = new BookService();
const reservationService = new ReservationService();

app.use(express.json());

app.post('/register', (req, res) => {
  const { email } = req.body;
  const success = authService.registerUser(email);
  res.json({ success });
});

app.post('/books', (req, res) => {
  const { title, author, available } = req.body;
  const book = { title, author, available };
  bookService.addBook(book);
  res.status(201).json(book);
});

app.get('/books', (req, res) => {
  res.json(bookService.getBooks());
});

app.post('/reservations', async (req, res) => {
  const { userId, bookId } = req.body;
  try {
    const reservation = await reservationService.reserveBook(userId, bookId);
    res.status(201).json({ success: true, reservation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.delete('/reservations/:id', (req, res) => {
  const success = reservationService.cancelReservation(req.params.id);
  res.json({ success });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
