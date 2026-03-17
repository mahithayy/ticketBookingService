const pool = require("../config/db");
const { BOOKING_STATUS } = require("../utils/constants");

exports.bookSeats = async (showId, seatCount) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Lock available seats
    const seatResult = await client.query(
      `SELECT * FROM seats
       WHERE show_id = $1 AND status = 'AVAILABLE'
       ORDER BY id
       LIMIT $2
       FOR UPDATE`,
      [showId, seatCount]
    );

    // Not enough seats → create FAILED booking
    if (seatResult.rows.length < seatCount) {
      const failedBooking = await client.query(
        `INSERT INTO bookings (show_id, status)
         VALUES ($1, $2) RETURNING *`,
        [showId, BOOKING_STATUS.FAILED]
      );

      await client.query("COMMIT");
      return failedBooking.rows[0];
    }

    const seatIds = seatResult.rows.map(s => s.id);

    // Step 1: create booking as PENDING
    const booking = await client.query(
      `INSERT INTO bookings (show_id, status)
       VALUES ($1, $2) RETURNING *`,
      [showId, BOOKING_STATUS.PENDING]
    );

    // Update seats
    await client.query(
      `UPDATE seats
       SET status = 'BOOKED'
       WHERE id = ANY($1::int[])`,
      [seatIds]
    );

    //Step 2: mark CONFIRMED
    await client.query(
      `UPDATE bookings SET status = $1 WHERE id = $2`,
      [BOOKING_STATUS.CONFIRMED, booking.rows[0].id]
    );

    await client.query("COMMIT");

    return {
      ...booking.rows[0],
      status: BOOKING_STATUS.CONFIRMED
    };

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};