const Expenses = require("../models/expense");

exports.getExpenses = (req, res) => {
  Expenses.findAll()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.createExpense = (req, res) => {
  const amount = req.body.amount;
  const description = req.body.description;
  const category = req.body.category;

  Expenses.create({
    amount: amount,
    description: description,
    category: category,
  })
    .then((result) => {
      console.log(result);
      res.send("Post request received");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteExpense = (req, res) => {
  const id = req.params.id;
  Expenses.findByPk(id)
    .then((expense) => {
      return expense.destroy();
    })
    .then((result) => {
      console.log("Deleted");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.updateExpense = (req, res) => {
  const id = req.params.id;
  const amount = req.body.amount;
  const description = req.body.description;
  const category = req.body.category;

  Expenses.findByPk(id)
    .then((expense) => {
      expense.amount = amount;
      expense.description = description;
      expense.category = category;
      return expense.save();
    })
    .then((result) => {
      res.send("Updated");
    })
    .catch((err) => {
      console.log(err);
    });
};
