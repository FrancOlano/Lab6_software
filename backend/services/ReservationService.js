class ReservationService {
  constructor() {
    this.reservations = [];
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
      this.reservations.splice(reservationIndex, 1);
      console.log(`Reservation ${reservationId} cancelled.`);
      return true;
    }
    return false;
  }
}

module.exports = ReservationService;
