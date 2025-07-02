const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

// Add an expense for a PG
router.post('/add', expenseController.addExpense);

// Get all expenses (optional)
router.get('/all', expenseController.getExpenses); // implement if needed

module.exports = router;
