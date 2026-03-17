const express = require("express");
const router = express.Router();
const showController = require("../controllers/show.controller");
const adminMiddleware = require("../middleware/auth.middleware");

router.post("/", adminMiddleware, showController.createShow);

router.get("/", showController.getShows);

router.get("/:id/seats", showController.getSeats);
module.exports = router;