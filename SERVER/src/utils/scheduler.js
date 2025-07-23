// utils/scheduler.js
const prisma = require('../config/db');
const dayjs = require('dayjs');

async function generateMonthlyPayments() {
  const today = dayjs();

  const pgs = await prisma.pG.findMany({
    where: { isActive: true },
    include: {
      beds: {
        where: { isOccupied: true },
        include: {
          guest: true,
        },
      },
    },
  });

  for (const pg of pgs) {
    if (today.date() !== pg.rentDueDay) continue;

    for (const bed of pg.beds) {
      const existing = await prisma.payment.findFirst({
        where: {
          userId: bed.guestId,
          bedId: bed.id,
          pgId: pg.id,
          month: today.format('YYYY-MM'),
        },
      });

      if (!existing) {
        await prisma.payment.create({
          data: {
            userId: bed.guestId,
            bedId: bed.id,
            pgId: pg.id,
            amount: bed.rent,
            month: today.format('YYYY-MM'),
            status: 'due',
          },
        });
      }
    }
  }

  console.log('Monthly payments generated');
}

module.exports = generateMonthlyPayments;
