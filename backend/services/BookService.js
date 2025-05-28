const db = require('../database');

class BookService {
  static recentlyAddedBooks = new Map();

  static async addBook(book) {
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO books (title, author, available) VALUES (?, ?, ?)", 
        [book.title, book.author, book.available ? 1 : 0],
        function(err) {
          if (err) {
            console.error('Error adding book:', err);
            reject(new Error('Failed to add book'));
            return;
          }
          const newBook = { ...book, id: this.lastID };
          BookService.recentlyAddedBooks.set(this.lastID, newBook);
          console.log(`Book "${book.title}" added with ID ${this.lastID}`);
          resolve(newBook);
        }
      );
    });
  }

  static async getBooks() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM books", [], (err, rows) => {
        if (err) {
          console.error('Error fetching books:', err);
          reject(new Error('Failed to fetch books'));
          return;
        }
        resolve(rows.map(row => ({
          ...row,
          available: row.available === 1
        })));
      });
    });
  }

  static async undoAddBook(bookId) {
    return new Promise((resolve, reject) => {
      if (!BookService.recentlyAddedBooks.has(Number(bookId))) {
        reject(new Error('Book not found in recently added list'));
        return;
      }

      db.run("DELETE FROM books WHERE id = ?", [bookId], (err) => {
        if (err) {
          console.error('Error removing book:', err);
          reject(new Error('Failed to remove book'));
          return;
        }
        const removedBook = BookService.recentlyAddedBooks.get(Number(bookId));
        BookService.recentlyAddedBooks.delete(Number(bookId));
        console.log(`Book "${removedBook.title}" removed`);
        resolve({ success: true, book: removedBook });
      });
    });
  }

  static async reserveBook(bookId) {
    return new Promise((resolve, reject) => {
      db.run("UPDATE books SET available = 0 WHERE id = ?", [bookId], (err) => {
        if (err) {
          console.error('Error reserving book:', err);
          reject(new Error('Failed to reserve book'));
          return;
        }
        console.log(`Book ${bookId} marked as reserved`);
        resolve(true);
      });
    });
  }

  static async cancelReservation(bookId) {
    return new Promise((resolve, reject) => {
      db.run("UPDATE books SET available = 1 WHERE id = ?", [bookId], (err) => {
        if (err) {
          console.error('Error cancelling reservation:', err);
          reject(new Error('Failed to cancel reservation'));
          return;
        }
        console.log(`Book ${bookId} marked as available`);
        resolve(true);
      });
    });
  }
}

module.exports = BookService;
