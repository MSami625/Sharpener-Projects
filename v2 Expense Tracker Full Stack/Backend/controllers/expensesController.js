const Expense = require("../models/Expense");
const User = require("../models/User");
const jwt = require("jsonwebtoken");  
const secret = process.env.JWT_SECRET;

exports.getAllExpenses = (req, res, next) => {

  const token = req.params.token;
  const verifyResult = jwt.verify(token, secret);
  const userId = verifyResult.userId;
  

  Expense.findAll({ where: { userId: userId } })
    .then((expenses) => {
      res.status(200).json(expenses);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Something went wrong",
      });
    });
};

exports.createExpense = (req, res, next) => {
  const { amount, description, category,token } = req.body;

  const verifyResult = jwt.verify(token, secret);
  const userId = verifyResult.userId;

  User.findByPk(userId)
    .then((user) => {
      return user.createExpense({
        amount: amount,
        description: description,
        category: category,
      });
    })
    .then((result) => {
      res.status(201).json({
        message: "Expense created successfully",
        expense: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Something went wrong",
      });
    });

};

exports.deleteExpense = (req, res, next) => {
  const expenseId = req.params.id;

  Expense.findByPk(expenseId)
    .then((expense) => {
      if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
      } else {
        expense.destroy();
        res.status(200).json({ message: "Expense deleted successfully" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Something went wrong" });
    });
};
