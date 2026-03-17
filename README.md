#  Ticket Booking System (Backend)

## Overview

A concurrency-safe ticket booking backend built using Node.js, Express, and PostgreSQL.
Simulates platforms like BookMyShow/RedBus with seat-level locking to prevent overbooking.

---

## Tech Stack

* Node.js
* Express.js
* PostgreSQL

---

## Setup

```bash
npm install
```

Create `.env`:

```
DATABASE_URL=postgresql://postgres:<password>@localhost:5432/ticketdb
```

Run:

```bash
npm run dev
```

---

## Database

Run `schema.sql` to create:

* shows
* seats
* bookings

---

## APIs

### Admin

* `POST /shows` (header: `role=admin`)

### User

* `GET /shows`
* `GET /shows/:id/seats`
* `POST /bookings`

---

## Concurrency Handling

* Uses PostgreSQL transactions + `SELECT ... FOR UPDATE`
* Seat-level locking ensures:

  * No race conditions
  * No overbooking
  * Atomic bookings

---

## Booking Lifecycle

* `PENDING` → processing
* `CONFIRMED` → success
* `FAILED` → insufficient seats / expired

---

## Bonus

* Background job marks stale `PENDING` bookings as `FAILED` after 2 minutes

---

## Notes

* Tested via Postman (including concurrent requests)
* Designed for correctness and scalability
