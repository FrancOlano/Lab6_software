class ReservationService {
  constructor(bookService) {
    this.reservations = [];
    this.bookService = bookService;
  }

  createReservation(reservation) {
    this.reservations.push(reservation);
    console.log(`Reservation created for ${reservation.bookId}.`);
  }

  getReservationsByUser(userId) {
    return this.reservations.filter(r => r.userId === userId);
  }

  cancelReservation(reservationId) {
    const reservationIndex = this.reservations.findIndex(r => r.id === reservationId);
    if (reservationIndex !== -1) {
      const reservation = this.reservations[reservationIndex];
      // Mark the book as available
      this.bookService.cancelReservation(reservation.bookId);
      this.reservations.splice(reservationIndex, 1);
      console.log(`Reservation ${reservationId} cancelled.`);
      return true;
    }
    return false;
  }
}

module.exports = ReservationService;
