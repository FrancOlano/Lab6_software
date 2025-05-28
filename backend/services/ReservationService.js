const db = require('../database');

class ReservationService {
  static async reserveBook(userId, bookId) {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM books WHERE id = ?", [bookId], (err, book) => {
        if (err) {
          console.error(err);
          reject(new Error('Error checking book availability'));
          return;
        }

        if (!book) {
          reject(new Error('Book not found'));
          return;
        }

        if (!book.available) {
          reject(new Error('Book is not available for reservation'));
          return;
        }

        // Get book Id first and then insert reservation
        db.run(
          "UPDATE books SET available = 0 WHERE id = ?",
          [bookId],
          function (err) {
            if (err) {
              console.error(err);
              reject(new Error('Error updating book availability'));
              return;
            }

            db.run(
              "INSERT INTO reservations (userId, bookId) VALUES (?, ?)",
              [userId, bookId],
              function (err) {
                if (err) {
                  console.error(err);
                  // Rollback the book availability update
                  db.run("UPDATE books SET available = 1 WHERE id = ?", [bookId]);
                  reject(new Error('Error creating reservation'));
                  return;
                }

                resolve({ 
                  id: this.lastID, 
                  userId, 
                  bookId, 
                  date: new Date().toISOString() 
                });
              }
            );
          }
        );
      });
    });
  }

  static async cancelReservation(reservationId) {
    return new Promise((resolve, reject) => {
      // First get the reservation to know which book to update
      db.get("SELECT bookId FROM reservations WHERE id = ?", [reservationId], (err, reservation) => {
        if (err) {
          console.error(err);
          reject(new Error('Error finding reservation'));
          return;
        }

        if (!reservation) {
          reject(new Error('Reservation not found'));
          return;
        }

        // Delete the reservation first
        db.run("DELETE FROM reservations WHERE id = ?", [reservationId], (err) => {
          if (err) {
            console.error(err);
            reject(new Error('Error cancelling reservation'));
            return;
          }

          // Then update the book availability
          db.run("UPDATE books SET available = 1 WHERE id = ?", [reservation.bookId], (err) => {
            if (err) {
              console.error(err);
              reject(new Error('Error updating book availability'));
              return;
            }

            resolve(true);
          });
        });
      });
    });
  }

  static async getUserReservations(userId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          r.id,
          r.userId,
          r.bookId,
          r.date,
          b.title as bookTitle,
          b.author as bookAuthor
        FROM reservations r
        JOIN books b ON b.id = r.bookId
        WHERE r.userId = ?
        ORDER BY r.date DESC
      `;

      db.all(query, [userId], (err, reservations) => {
        if (err) {
          console.error(err);
          reject(new Error('Error fetching user reservations'));
          return;
        }

        resolve(reservations.map(r => ({
          id: r.id,
          userId: r.userId,
          bookId: r.bookId,
          date: r.date,
          book: {
            id: r.bookId,
            title: r.bookTitle,
            author: r.bookAuthor
          }
        })));
      });
    });
  }
}

module.exports = ReservationService;
