const express = require("express");
const router = express.Router();
const expensesController = require('../controllers/expensesController');

router.get('/', expensesController.getAllExpenses);
router.post('/', expensesController.createExpense);
// edit 
router.delete('/:id', expensesController.deleteExpense);    


module.exports = router;