const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create expense
exports.createExpense = async (req, res) => {
  try {
    const { title, amount, category, userId } = req.body;
    const expense = await prisma.expense.create({
      data: { title, amount: parseFloat(amount), category, userId },
    });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all expenses
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update expense
exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, category } = req.body;
    const expense = await prisma.expense.update({
      where: { id: Number(id) },
      data: { title, amount: parseFloat(amount), category },
    });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete expense
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.expense.delete({ where: { id: Number(id) } });
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
