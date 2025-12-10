import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getShows = async (req: Request, res: Response) => {
    try {
        const shows = await prisma.show.findMany({
            include: {
                seats: true // Include seats for simple checking, optimization: fetch separately if too large
            }
        });
        res.json(shows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch shows' });
    }
};

export const getShowDetails = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const show = await prisma.show.findUnique({
            where: { id: Number(id) },
            include: { seats: true }
        });
        if (!show) return res.status(404).json({ error: 'Show not found' });
        res.json(show);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch show details' });
    }
};

export const bookSeats = async (req: Request, res: Response) => {
    const { userId, showId, seatIds } = req.body; // seatIds: number[]

    if (!seatIds || seatIds.length === 0) {
        return res.status(400).json({ error: 'No seats selected' });
    }

    try {
        const result = await prisma.$transaction(async (tx) => {
            // 1. Check if all seats are available
            const seats = await tx.seat.findMany({
                where: {
                    id: { in: seatIds },
                    showId: showId
                }
            });

            if (seats.length !== seatIds.length) {
                throw new Error('Some seats do not exist');
            }

            const unavailableSeats = seats.filter(s => s.status !== 'AVAILABLE');
            if (unavailableSeats.length > 0) {
                throw new Error(`Seats ${unavailableSeats.map(s => `${s.row}${s.number}`).join(', ')} are already booked`);
            }

            // 2. Create Booking
            const booking = await tx.booking.create({
                data: {
                    userId,
                    status: 'CONFIRMED', // Direct confirmation for simplicity, or PENDING
                    createdAt: new Date()
                }
            });

            // 3. Update Seats
            await tx.seat.updateMany({
                where: { id: { in: seatIds } },
                data: {
                    status: 'BOOKED',
                    bookingId: booking.id
                }
            });

            return booking;
        });

        res.status(200).json({ message: 'Booking successful', booking: result });
    } catch (error: any) {
        console.error('Booking failed:', error.message);
        res.status(409).json({ error: error.message || 'Booking failed due to conflict' });
    }
};
