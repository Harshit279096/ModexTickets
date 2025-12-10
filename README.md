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

## 🚀 Deployment Guide (Render)

This project is configured for **1-Click Deployment** on Render.

### Phase 1: Backend & Database
1.  Log in to [Render Dashboard](https://dashboard.render.com).
2.  Click **New +** -> **Blueprint**.
3.  Connect your GitHub repository.
4.  Render will auto-detect `render.yaml`. Click **Apply**.
5.  Wait for deployment to finish.
6.  **Copy the Backend Service URL** (e.g., `https://modex-backend-xyz.onrender.com`).

### Phase 2: Frontend
1.  On Render, click **New +** -> **Static Site**.
2.  Connect the same repository.
3.  **Settings**:
    *   **Root Directory**: `frontend`
    *   **Build Command**: `npm install && npm run build`
    *   **Publish Directory**: `dist`
4.  **Environment Variables**:
    *   Key: `VITE_API_URL`
    *   Value: `YOUR_BACKEND_URL` (from Phase 1).
5.  Click **Create Static Site**.

Your full-stack app is now live!
