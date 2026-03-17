const pool = require("../config/db");

setInterval(async () => {
  try {
    await pool.query(`
      UPDATE bookings
      SET status = 'FAILED'
      WHERE status = 'PENDING'
      AND created_at < NOW() - INTERVAL '2 minutes'
    `);

    console.log("Expired old bookings");
  } catch (err) {
    console.error(err);
  }
}, 60000); // every 1 min