const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const Book = require('../models/Book');

// Cancel a reservation
router.delete('/:id', (req, res) => {
  const reservationId = req.params.id;
  // Find the reservation
  const reservationIndex = Reservation.all.findIndex(r => r.id === reservationId);
  if (reservationIndex === -1) {
    return res.status(404).json({ message: 'Reservation not found' });
  }
  const reservation = Reservation.all[reservationIndex];

  // Find the book and mark as available
  const book = Book.all.find(b => b.title === reservation.bookTitle);
  if (book) {
    book.available = true;
  }

  // Remove reservation
  Reservation.all.splice(reservationIndex, 1);

  // Confirm action
  res.json({ message: 'Reservation cancelled successfully.' });
});

module.exports = router;