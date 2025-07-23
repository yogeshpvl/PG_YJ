const prisma = require('../config/db');

// Create Expense
const createExpense = async (req, res) => {
  try {
    const { amount, description, pgId, category, date } = req.body;
    const userId = req.user.id;

    // Validate date
    const parsedDate = date ? new Date(date) : new Date();
    if (isNaN(parsedDate)) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    const expense = await prisma.expense.create({
      data: {
        amount,
        description,
        category,
        pgId,
        userId,
        date: parsedDate,
      },
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Expenses (for admin)
const getExpenses = async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany();
    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    console.error('Get All Expenses Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Get Expenses by Authenticated User
const getMyExpenses = async (req, res) => {
  try {
    const userId = req.user.id;

    const expenses = await prisma.expense.findMany({
      where: { userId },
    });

    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    console.error('Get My Expenses Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Get Expenses by PG ID
const getExpensesByPG = async (req, res) => {
  try {
    const { pgId } = req.params;

    const expenses = await prisma.expense.findMany({
      where: { pgId: parseInt(pgId) },
    });

    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    console.error('Get Expenses by PG Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Update Expense
const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, title, date } = req.body;

    const expense = await prisma.expense.update({
      where: { id: parseInt(id) },
      data: {
        amount: parseFloat(amount),
        title,
        date: new Date(date),
      },
    });

    res.status(200).json({ success: true, data: expense });
  } catch (error) {
    console.error('Update Expense Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Delete Expense
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.expense.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ success: true, message: 'Expense deleted' });
  } catch (error) {
    console.error('Delete Expense Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const getFilteredExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const { pgId } = req.params;
    const { category, startDate, endDate } = req.query;

    const where = {
      userId,
      pgId: Number(pgId),
      ...(category && { category }),
      ...(startDate && endDate && {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      }),
    };

    const expenses = await prisma.expense.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

    res.status(200).json({
      totalAmount,
      count: expenses.length,
      expenses,
    });
  } catch (err) {
    console.error('Error filtering expenses:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createExpense,
  getExpenses,
  getMyExpenses,
  getExpensesByPG,
  updateExpense,
  deleteExpense,
  getFilteredExpenses
};
