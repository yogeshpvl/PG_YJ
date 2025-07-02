const prisma = require('../config/prisma');

exports.addExpense = async (req, res) => {
  const { amount, reason, pgId } = req.body;

  try {
    const expense = await prisma.expense.create({
      data: { amount, reason, pgId },
    });
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add expense', detail: err });
  }
};
