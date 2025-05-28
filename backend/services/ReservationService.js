const db = require('../database');

class ReservationService {
  createReservation(reservation) {
    return new Promise((resolve, reject) => {
      db.run("INSERT INTO reservations (userId, bookId, date) VALUES (?, ?, ?)", [reservation.userId, reservation.bookId, reservation.date], function(err) {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log(`Reservation created for ${reservation.bookId}.`);
          resolve(true);
        }
      });
    });
  }

  getReservationsByUser(userId) {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM reservations WHERE userId = ?", [userId], (err, rows) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  cancelReservation(reservationId) {
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM reservations WHERE rowid = ?", [reservationId], function(err) {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log(`Reservation ${reservationId} cancelled.`);
          resolve(true);
        }
      });
    });
  }
}

module.exports = ReservationService;
