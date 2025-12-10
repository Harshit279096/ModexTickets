import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Deleting all seats...');
    await prisma.seat.deleteMany({});

    console.log('Deleting all bookings...');
    await prisma.booking.deleteMany({});

    console.log('Deleting all shows...');
    await prisma.show.deleteMany({});

    console.log('Database cleared successfully.');
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
