const db = require('../database');

class BookService {
  addBook(book) {
    return new Promise((resolve, reject) => {
      db.run("INSERT INTO books (title, author, available) VALUES (?, ?, ?)", [book.title, book.author, book.available], function(err) {
        if (err) {
          console.error(err);
          reject(err);
        } else {
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
