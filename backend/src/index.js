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

app.post('/books', async (req, res) => {
  const { title, author, available } = req.body;
  const book = { title, author, available };
  try {
    const result = await bookService.addBook(book);
    res.status(201).json({...book, id: bookService.recentlyAddedBooks[bookService.recentlyAddedBooks.length -1].id});
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ error: 'Failed to add book' });
  }
});

app.delete('/books/:id', async (req, res) => {
  const bookId = req.params.id;
  try {
    await bookService.undoAddBook(bookId);
    res.json({ message: 'Book removed successfully' });
  } catch (error) {
    console.error("Error removing book:", error);
    res.status(500).json({ error: 'Failed to remove book' });
  }
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
