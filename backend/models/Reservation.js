class Reservation {
  constructor(id, userId, bookId, date) {
    this.id = id;
    this.userId = userId;
    this.bookId = bookId;
    this.date = date;
  }
}

module.exports = Reservation;
