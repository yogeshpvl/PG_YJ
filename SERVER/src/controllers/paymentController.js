const prisma = require('../config/db');

exports.createPayment = async (req, res) => {
  try {
    const { amount, date, month, guestId, pgId, status } = req.body;
    const payment = await prisma.payment.create({
      data: {
        amount: parseFloat(amount),
        date: new Date(date),
        month,
        guestId,
        pgId,
        status,
      },
    });
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all payments for PG
exports.getPayments = async (req, res) => {
  try {
    const pgId = parseInt(req.params.pgId);
    const payments = await prisma.payment.findMany({ where: { pgId } });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
