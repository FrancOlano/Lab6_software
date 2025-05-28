const Reservation = require('../models/Reservation');
const Book = require('../models/Book');

async function reserveBook(userId, bookId) {
  try {
    const book = await Book.findById(bookId);

    if (!book) {
      throw new Error('Book not found');
    }

    if (!book.available || book.reserved) {
      throw new Error('Book is not available for reservation');
    }

    const reservation = new Reservation({
      user: userId,
      book: bookId
    });

    await reservation.save();

    book.reserved = true;
    book.available = false;
    await book.save();

    return reservation;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  reserveBook
};
