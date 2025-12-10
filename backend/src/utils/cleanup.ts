import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const startCleanupJob = () => {
    // Run every minute
    setInterval(async () => {
        try {
            const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

            // Find locked/pending bookings older than 2 mins
            // NOTE: My current setup creates CONFIRMED directly, but this is the logic 
            // if we had a PENDING state flow as per requirements.
            // I will update 'PENDING' ones just in case.
            const expiredBookings = await prisma.booking.findMany({
                where: {
                    status: 'PENDING',
                    createdAt: {
                        lt: twoMinutesAgo
                    }
                },
                include: { seats: true }
            });

            if (expiredBookings.length > 0) {
                console.log(`Found ${expiredBookings.length} expired bookings. Cleaning up...`);

                await prisma.$transaction(async (tx) => {
                    for (const booking of expiredBookings) {
                        // Update booking status
                        await tx.booking.update({
                            where: { id: booking.id },
                            data: { status: 'FAILED' }
                        });

                        // Free up seats
                        await tx.seat.updateMany({
                            where: { bookingId: booking.id },
                            data: { status: 'AVAILABLE', bookingId: null }
                        });
                    }
                });

                console.log('Cleanup complete.');
            }
        } catch (error) {
            console.error('Error in cleanup job:', error);
        }
    }, 60 * 1000);
};
