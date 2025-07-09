const express = require('express');
const router = express.Router();
const {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getExpensesByUser,
  getExpensesByPG
} = require('../controllers/expenseController');


// Create, Update, Delete
router.post('/', createExpense);
router.get('/', getExpenses);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

// New routes
router.get('/user/:userId', getExpensesByUser);
router.get('/pg/:pgId', getExpensesByPG);

module.exports = router;
