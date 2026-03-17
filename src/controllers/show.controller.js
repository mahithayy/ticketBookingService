const pool = require("../config/db");

// Create show

exports.createShow = async (req, res) => {
  const client = await pool.connect();

  try {
    const { name, start_time, total_seats } = req.body;

    // Validation
    if (!name || !start_time || !total_seats || total_seats <= 0) {
      return res.status(400).json({ message: "Invalid input" });
    }

    await client.query("BEGIN");

    const showResult = await client.query(
      `INSERT INTO shows (name, start_time)
       VALUES ($1, $2) RETURNING *`,
      [name, start_time]
    );

    const showId = showResult.rows[0].id;

    for (let i = 1; i <= total_seats; i++) {
      await client.query(
        `INSERT INTO seats (show_id, seat_number)
         VALUES ($1, $2)`,
        [showId, i]
      );
    }

    await client.query("COMMIT");

    res.json(showResult.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};
// Get all shows
exports.getShows = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM shows");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getSeats = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM seats WHERE show_id = $1",
      [id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};