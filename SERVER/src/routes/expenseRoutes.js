const express = require('express');
const router = express.Router();
const {
  createExpense,
  getExpenses,
  getMyExpenses,
  getExpensesByPG,
  updateExpense,
  deleteExpense,
  getFilteredExpenses
} = require('../controllers/expenseController');
const { protect } = require('../middlewares/authmiddleware');

// Create Expense
router.post('/', protect, createExpense);

// Get all expenses (admin)
router.get('/', getExpenses);

// Get logged-in user’s expenses
router.get('/my', protect, getMyExpenses);

// Get expenses by PG ID
router.get('/pg/:pgId', protect, getExpensesByPG);

// Update expense
router.put('/:id', protect, updateExpense);

// Delete expense
router.delete('/:id', protect, deleteExpense);
router.get('/pg/:pgId/filter',protect, getFilteredExpenses);

module.exports = router;
