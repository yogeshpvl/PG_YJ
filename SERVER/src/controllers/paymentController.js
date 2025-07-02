const prisma = require('../config/prisma');

exports.addPayment = async (req, res) => {
  const { amount, month, userId } = req.body;

  try {
    const payment = await prisma.payment.create({
      data: { amount, month, userId },
    });
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ error: 'Payment failed', detail: err });
  }
};

exports.getPayments = async (req, res) => {
  const payments = await prisma.payment.findMany({
    include: { user: true },
  });
  res.json(payments);
};
