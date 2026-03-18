# Ticket Booking System (Backend)

## Overview
A high-concurrency ticket booking backend API built with Node.js, Express, and PostgreSQL. Designed to simulate the core functionality of platforms like BookMyShow or RedBus, it utilizes strict seat-level locking to ensure data consistency and entirely prevent overbooking during concurrent requests.

---

## Tech Stack
Runtime: Node.js ,Framework: Express.js
Database:PostgreSQL (with `pg` driver)
---

## Setup & Local Development

1. **Install dependencies:**
   ```bash
   npm install

Environment Variables:
Create a .env file in the root directory:
DATABASE_URL=postgresql://postgres:<password>@localhost:5432/ticketdb
PORT=3000

Database Setup:
Run the SQL commands provided in src/models/schema.sql to generate the shows, seats, and bookings tables, along with necessary indexes.

Start the server:
Bash
npm run dev


API Documentation
Admin Operations
POST /shows
Headers: role: admin
Body: { "name": "Avengers", "start_time": "2026-03-16T18:00:00Z", "total_seats": 50 }
Description: Creates a new show and automatically generates the corresponding available seats.
User Operations
GET /shows
Description: Retrieves all available shows.
GET /shows/:id/seats
Description: Retrieves the seat layout and current status (AVAILABLE, BOOKED) for a specific show.
POST /bookings
Body: { "show_id": 1, "seats": 3 }
Description: Attempts to book the specified number of seats. Returns booking status (PENDING, CONFIRMED, or FAILED).

Architecture & Concurrency Handling
Atomicity: Uses PostgreSQL transactions (BEGIN / COMMIT / ROLLBACK) to ensure operations succeed or fail as a single unit.
Pessimistic Locking: Implements SELECT * FROM seats ... FOR UPDATE to lock available seats at the database level . This guarantees that concurrent requests for the same show cannot double-book seats .
Booking Lifecycle: Bookings initiate as PENDING, lock the seats to BOOKED, and immediately resolve to CONFIRMED. If insufficient seats exist, it resolves to FAILED .

Bonus Features
Automated Expiry: A background chron job (expiry.job.js) runs every minute to scan for stale PENDING bookings older than 2 minutes and marks them as FAILED, freeing up system state .

