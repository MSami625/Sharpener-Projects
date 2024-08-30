const express = require("express");
const router = express.Router();
const expensesController = require('../controllers/expensesController');

router.get('/user/expenses/:token', expensesController.getAllExpenses);
router.post('/expenses', expensesController.createExpense);
// edit
router.delete('/user/expenses/:id', expensesController.deleteExpense);    


module.exports = router;