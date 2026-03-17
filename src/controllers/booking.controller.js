const bookingService = require("../services/booking.service");

exports.createBooking = async (req, res) => {
  try {
    const { show_id, seats } = req.body;

    //Validation
    if (!show_id || !seats || seats <= 0) {
      return res.status(400).json({
        status: "FAILED",
        message: "Invalid input"
      });
    }

    const booking = await bookingService.bookSeats(show_id, seats);

    res.json({
      status: booking.status,
      booking
    });
  } catch (err) {
    res.status(400).json({
      status: "FAILED",
      message: err.message
    });
  }
};