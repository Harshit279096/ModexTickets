import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createShow = async (req: Request, res: Response) => {
    try {
        const { name, startTime, totalSeats, price } = req.body;

        const show = await prisma.show.create({
            data: {
                name,
                startTime: new Date(startTime),
                totalSeats,
                price
            }
        });

        // Automatically generate seats (e.g., 10 seats per row)
        const seatsPerRow = 10;
        const totalRows = Math.ceil(totalSeats / seatsPerRow);
        const seatPromises = [];

        for (let r = 0; r < totalRows; r++) {
            const rowLabel = String.fromCharCode(65 + r); // A, B, C...
            for (let n = 1; n <= seatsPerRow; n++) {
                if ((r * seatsPerRow + n) > totalSeats) break;
                seatPromises.push({
                    row: rowLabel,
                    number: n,
                    showId: show.id,
                    status: 'AVAILABLE'
                });
            }
        }

        await prisma.seat.createMany({
            data: seatPromises
        });

        res.status(201).json({ message: 'Show created successfully', show });
    } catch (error) {
        console.error('Error creating show:', error);
        res.status(500).json({ error: 'Failed to create show' });
    }
};
