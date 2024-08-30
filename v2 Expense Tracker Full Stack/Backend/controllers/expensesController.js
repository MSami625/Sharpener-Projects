const Expense = require("../models/Expense");
const User = require("../models/User");

exports.getAllExpenses = (req, res, next) => {
  Expense.findAll()
    .then((expenses) => {
      res.status(200).json(
        expenses  
      );
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Something went wrong",
      });
    });
};

exports.createExpense = (req, res, next) => {
  const { amount, description, category } = req.body;

  Expense.create({
    amount: amount,
    description: description,
    category: category,
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
  .then((expense)=>{
      if(!expense){
        return res.status(404).json({message: "Expense not found"});

      }else{
        expense.destroy();
        res.status(200).json({message: "Expense deleted successfully"}); 
      }
  }).catch((err)=>{
    console.log(err);
    res.status(500).json({message: "Something went wrong"});
  });
}