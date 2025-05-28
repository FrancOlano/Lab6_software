const db = require('../database');

class BookService {
  constructor() {
    this.recentlyAddedBooks = [];
  }
  addBook(book) {
    return new Promise((resolve, reject) => {
      db.run("INSERT INTO books (title, author, available) VALUES (?, ?, ?)", [book.title, book.author, book.available], function(err) {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          this.recentlyAddedBooks.push({...book, id: this.lastID});
          console.log(`${book.title} added.`);
          resolve(true);
        }
      });
    });
  }

  getBooks() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM books", [], (err, rows) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  undoAddBook(bookId) {
    return new Promise((resolve, reject) => {
      const bookIndex = this.recentlyAddedBooks.findIndex((book) => book.id === bookId);
      if (bookIndex === -1) {
        reject(new Error('Book not found in recently added list.'));
        return;
      }
      const bookToRemove = this.recentlyAddedBooks[bookIndex];
      db.run("DELETE FROM books WHERE rowid = ?", [bookId], function(err) {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          this.recentlyAddedBooks.splice(bookIndex, 1);
          console.log(`${bookToRemove.title} removed.`);
          resolve(true);
        }
      });
    });
  }

  reserveBook(bookId) {
    return new Promise((resolve, reject) => {
      db.run("UPDATE books SET available = 0 WHERE rowid = ?", [bookId], function(err) {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log(`Book ${bookId} reserved.`);
          resolve(true);
        }
      });
    });
  }

  cancelReservation(bookId) {
    return new Promise((resolve, reject) => {
      db.run("UPDATE books SET available = 1 WHERE rowid = ?", [bookId], function(err) {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log(`Book ${bookId} reservation cancelled.`);
          resolve(true);
        }
      });
    });
  }
}

module.exports = BookService;
