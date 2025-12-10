# Modex Ticket Booking System

A premium, high-concurrency ticket booking platform built with Node.js, Express, SQLite (local)/Postgres (prod), and React.

## Features
- **High Concurrency Handling**: Uses atomic database transactions to prevent overbooking.
- **Premium UI**: Glassmorphism design with responsive animations.
- **Admin Dashboard**: Create and manage shows.
- **Real-time Seat Selection**: Interactive grid for booking.

## Tech Stack
- **Backend**: Node.js, Express, Prisma, SQLite (Dev)
- **Frontend**: React, TypeScript, Vite, Vanilla CSS
- **Database**: SQLite (easy setup) or Postgres

## Setup Instructions

### Prerequisites
- Node.js (v18+)

### Backend
1. Navigate to `backend`:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize Database:
   ```bash
   npx prisma db push
   ```
4. Start Server:
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:3000`.

### Frontend
1. Navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start Dev Server:
   ```bash
   npm run dev
   ```
   App runs on `http://localhost:5173`.

## API Documentation

### Admin
- `POST /api/admin/shows`: Create a show.
  - Body: `{ name, startTime, totalSeats, price }`

### User
- `GET /api/shows`: List all shows.
- `GET /api/shows/:id`: Get show details and seats.
- `POST /api/bookings`: Book seats.
  - Body: `{ userId, showId, seatIds: [] }`

## Deployment Guide

### Backend (Render/Railway)
1. Push code to GitHub.
2. Create web service on Render.
3. Set build command: `npm install && npx prisma generate && npx tsc`.
4. Set start command: `node dist/server.js`.
5. Set env variables (`DATABASE_URL`).

### Frontend (Vercel)
1. Push to GitHub.
2. Import project in Vercel.
3. Set preset to Vite.
4. Deploy.
