import React, { useEffect, useState } from 'react';

function MyReservations({ userId }) {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    // Fetch reservations for the user
    fetch(`/api/reservations?userId=${userId}`)
      .then(res => res.json())
      .then(data => setReservations(data));
  }, [userId]);

  const cancelReservation = async (id) => {
    const res = await fetch(`/api/reservations/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      setReservations(reservations.filter(r => r.id !== id));
      alert('Reservation cancelled.');
    } else {
      alert('Could not cancel reservation.');
    }
  };

  return (
    <div>
      <h2>My Reservations</h2>
      <ul>
        {reservations.map(r => (
          <li key={r.id}>
            Book ID: {r.bookId} | Date: {r.date}
            <button onClick={() => cancelReservation(r.id)}>Cancel</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyReservations;