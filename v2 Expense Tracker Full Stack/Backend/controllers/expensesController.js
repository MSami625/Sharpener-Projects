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

exports.createExpense =async  (req, res, next) => {
  const { amount, description, category,token } = req.body;

  const verifyResult = jwt.verify(token, secret);
  const userId = verifyResult.userId;

  try {
   
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.createExpense({
      amount: amount,
      description: description,
      category: category,
    });

  
    const totalExpense = parseFloat(user.totalExpense) || 0;
    const newAmount = parseFloat(amount);

    user.totalExpense = totalExpense + newAmount;
    await user.save();

    // Step 4: Respond with a success message
    res.status(201).json({
      message: "Expense created and totalExpense updated successfully",
      expense: {
        amount: amount,
        description: description,
        category: category,
      },
      totalExpense: user.totalExpense,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong",
    });
  }

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
