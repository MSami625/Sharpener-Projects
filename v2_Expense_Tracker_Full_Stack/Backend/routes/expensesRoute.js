const express = require("express");
const router = express.Router();
const expensesController = require("../controllers/expensesController");
const authenticate = require("../middlewares/authenticate");

router.get("/user/expenses/:condition", expensesController.getAllExpenses);
router.post("/expenses", expensesController.createExpense);
// edit
router.delete(
  "/user/expenses/:id",
  authenticate,
  expensesController.deleteExpense
);

module.exports = router;
