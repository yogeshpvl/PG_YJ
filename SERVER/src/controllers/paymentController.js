
const prisma = require('../config/db');

exports.createPayment = async (req, res) => {
  try {
    const { amount, date, month, userId, pgId, status, paidDate,bedId } = req.body;
    const payment = await prisma.payment.create({
      data: { amount, date: new Date(date),bedId, month, userId, pgId, status, paidDate: paidDate ? new Date(paidDate) : null },
    });
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const { pgId, userId, month, status, startDate, endDate, search } = req.query;

    const filters = {};

    if (pgId) filters.pgId = parseInt(pgId);
    if (userId) filters.userId = parseInt(userId);
    if (month) filters.month = month;
    if (status) filters.status = status;
    if (startDate && endDate) {
      filters.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    // Add search condition if guest name or bed label is provided
    if (search) {
      filters.OR = [
        {
          guest: {
            name: {
              contains: search,
              mode: 'insensitive'
            }
          }
        },
        {
          guest: {
            bed: {
              label: {
                contains: search,
                mode: 'insensitive'
              }
            }
          }
        }
      ];
    }

    const payments = await prisma.payment.findMany({
      where: filters,
      include: {
        guest: {
          select: {
            name: true,
            bed: {
              select: {
                label: true,
                room: {
                  select: {
                    number: true,
                    floor: {
                      select: { name: true }
                    }
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await prisma.payment.findUnique({
      where: { id: parseInt(id) },
      include: { guest: true }
    });
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      amount,
      date,
      month,
      userId,
      pgId,
      status,
      paidDate
    } = req.body;

    const data = {};

    if (amount !== undefined) data.amount = amount;
    if (date) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate)) {
        return res.status(400).json({ error: 'Invalid date format' });
      }
      data.date = parsedDate;
    }
    if (month !== undefined) data.month = month;
    if (userId !== undefined) data.userId = userId;
    if (pgId !== undefined) data.pgId = pgId;
    if (status !== undefined) data.status = status;
    if (paidDate !== undefined) {
      const parsedPaidDate = paidDate ? new Date(paidDate) : null;
      if (paidDate && isNaN(parsedPaidDate)) {
        return res.status(400).json({ error: 'Invalid paidDate format' });
      }
      data.paidDate = parsedPaidDate;
    }

    const payment = await prisma.payment.update({
      where: { id: parseInt(id) },
      data,
    });

    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.payment.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Payment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
