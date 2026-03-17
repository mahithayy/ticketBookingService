const express = require("express");
const app = express();
const cors = require("cors");

const showRoutes = require("./routes/show.routes");
const bookingRoutes = require("./routes/booking.routes");

app.use(express.json());
app.use(cors());
app.use("/shows", showRoutes);
app.use("/bookings", bookingRoutes);

module.exports = app;