# System Design Document: Scalable Ticket Booking System

## 1. High-Level Architecture
To scale this application to the level of RedBus or BookMyShow, we would transition from a monolithic architecture to a **Microservices Architecture**.

### Key Components
1.  **API Gateway (Nginx/Kong)**: Entry point for specific rate limiting, SSL termination, and routing (e.g., `/api/booking` -> Booking Service).
2.  **Auth Service**: Handles JWT authentication independently.
3.  **Show/Inventory Service**: Manages shows, buses, routes, and initial caching of availability.
4.  **Booking Service (Core)**: Handles the transactional logic of locking seats and confirming bookings.
5.  **Payment Service**: Integrates with gateways (Stripe/Razorpay) and manages Webhooks.
6.  **Notification Service**: Async worker for sending Emails/SMS via queues.

## 2. Database Design & Scaling
### Database Choice
- **Primary Transactional DB**: PostgreSQL (ACID compliance is critical for bookings).
- **Read Replicas**: Use Read Replicas for `GET /shows` operations which have high read:write ratios (100:1).

### Scaling Strategies
- **Sharding**: Shard the `Booking` and `Seat` tables based on `showId` or `region`. This ensures all bookings for a specific show land on the same shard, simplifying locking logic.
- **Replication**: Master node for Writes (Bookings), Multiple Read Replicas for Reads (Browsing seats).

## 3. Concurrency Control Mechanisms
This is the most critical part of the system.
### Current Implementation
We use **Pessimistic Locking (Row-Level Locking)** via Database Transactions.
- When a user selects seats, we effectively run `SELECT ... FOR UPDATE` (or Prisma equivalent inside transaction).
- This prevents race conditions at the database level.

### Scaling for Production
For millions of users, holding DB locks is expensive. We would move to a **Distributed Lock** mechanism (e.g., **Redis Redlock**):
1.  User clicks "Pay".
2.  Acquire lock in Redis: `SET resource_name:show_1_seat_12 my_random_value NX PX 30000`
3.  If lock acquired -> Proceed to DB transaction.
4.  If not -> Return "Seat Reserved".
This offloads pressure from Postgres.

## 4. Caching Strategy
- **CDN (Cloudflare)**: Cache static assets and the frontend.
- **Redis/Memcached**:
    - Cache `Show` details (Price, Time) as they rarely change.
    - Cache `SeatMap` availability with a TTL (e.g., 1 second) to serve 99% of read traffic without hitting DB.
    - **Write-Through Cache**: Invalidate cache immediately upon a successful booking.

## 5. Message Queues (Decoupling)
Use **RabbitMQ** or **Apache Kafka** for:
- **Booking Confirmation**: After payment success, publish `booking_confirmed` event.
- **Consumers**:
    - Email Service sends ticket.
    - Analytics Service updates dashboard.
    - Loyalty Service adds points.
This ensures user checking out is fast and doesn't wait for emails to send.
