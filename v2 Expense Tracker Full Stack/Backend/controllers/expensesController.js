const Expense = require("../models/Expense");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
const sequelize = require("../util/database");

exports.getAllExpenses = async (req, res, next) => {
  try {
   
    const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;
    if (!token) {
      return res.status(401).json({ message: "Token not found" });
    }

     var verifyResult = jwt.verify(token, secret);
    const userId = verifyResult.userId;
    const isPremiumUser = verifyResult.isPremiumUser;

    const expenses = await Expense.findAll({ where: { userId: userId } });

    res.status(200).json({ expenses, isPremiumUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};


exports.createExpense = async (req, res, next) => {
  try {
    const { amount, description, category, token } = req.body;
    const t = await sequelize.transaction();

    if (!token) {
      return res.status(401).json({ message: "Token not found" });
    }

    const verifyResult = jwt.verify(token, secret);
    const userId = verifyResult.userId;

    if (!userId) {
      await t.rollback();
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findByPk(userId, { transaction: t });
    if (!user) {
      await t.rollback();
      return res.status(404).json({ message: "User not found" });
    }

    const expense = await Expense.create(
      {
        amount: amount,
        description: description,
        category: category,
        userId: userId,
      },
      { transaction: t }
    );

    const totalExpense = parseFloat(user.totalExpense) || 0;
    const newAmount = parseFloat(amount);

    user.totalExpense = totalExpense + newAmount;
    const result=await user.save({ transaction: t });
 
     if (!result) {
      await t.rollback();
      return res.status(400).json({ message: "Error in updating totalExpense" });
     }
     
     await t.commit();
 
    const isPremiumUser = user.isPremiumUser;

    res.status(201).json({
      message: "Expense created and totalExpense updated successfully",
      expense,
      totalExpense: user.totalExpense,
      isPremiumUser,
    });
  } catch (err) {
    console.error(err); 
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};



exports.deleteExpense = async (req, res, next) => {
  const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ message: "Token not found" });
  }

  try {
   
    const verifyResult = jwt.verify(token, secret);
    const userId = verifyResult.userId;


    const expenseId = req.params.id;
    const t = await sequelize.transaction();
    
    const expense = await Expense.findByPk(expenseId, { transaction: t });
    if (!expense) {
      await t.rollback();
      return res.status(404).json({ message: "Expense not found" });
    }

    const amount = expense.amount;
    await expense.destroy({ transaction: t });

    const user = await User.findByPk(expense.userId, { transaction: t });
    if (user) {
      const totalExpense = parseFloat(user.totalExpense) || 0;
      const newAmount = parseFloat(amount);

      user.totalExpense = totalExpense - newAmount;
      await user.save({ transaction: t });
    }

    await t.commit();

    res.status(200).json({
      message: "Expense deleted successfully",
      isPremiumUser: user.isPremiumUser,
      totalExpense: user.totalExpense,
    });
  } catch (err) {
    console.error('Error in deleteExpense:', err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid or malformed token" });
    }
    await t.rollback();
    res.status(500).json({ message: "Something went wrong on Deletion of records" });
  }
};
