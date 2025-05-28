const db = require('../database');

async function reserveBook(userId, bookId) {
  return new Promise((resolve, reject) => {
    db.get("SELECT available FROM books WHERE rowid = ?", [bookId], (err, row) => {
      if (err) {
        console.error(err);
        reject(err);
        return;
      }

      if (!row) {
        reject(new Error('Book not found'));
        return;
      }

      if (!row.available) {
        reject(new Error('Book is not available for reservation'));
        return;
      }

      db.run(
        "INSERT INTO reservations (userId, bookId) VALUES (?, ?)",
        [userId, bookId],
        function (err) {
          if (err) {
            console.error(err);
            reject(err);
            return;
          }

          db.run(
            "UPDATE books SET available = 0 WHERE rowid = ?",
            [bookId],
            function (err) {
              if (err) {
                console.error(err);
                reject(err);
                return;
              }

              resolve({ id: this.lastID, userId, bookId });
            }
          );
        }
      );
    });
  });
}

async function cancelReservation(reservationId) {
    return new Promise((resolve, reject) => {
        db.run("DELETE FROM reservations WHERE rowid = ?", [reservationId], function(err) {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }

            db.run("UPDATE books SET available = 1 WHERE rowid = (SELECT bookId FROM reservations WHERE rowid = ?)", [reservationId], function(err) {
                if (err) {
                    console.error(err);
                    reject(err);
                    return;
                }
                resolve(true);
            });
        });
    });
}

module.exports = {
  reserveBook,
  cancelReservation
};
