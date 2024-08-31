const Expense = require("../models/Expense");
const User = require("../models/User");
const jwt = require("jsonwebtoken");  
const secret = process.env.JWT_SECRET;

exports.getAllExpenses = (req, res, next) => {

  try{

  const token = req.params.token;
  const verifyResult = jwt.verify(token, secret);
  const userId = verifyResult.userId;
  const isPremiumUser = verifyResult.isPremiumUser;
   

  Expense.findAll({ where: { userId: userId } })
    .then((expenses) => {
      res.status(200).json({expenses, isPremiumUser});
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Something went wrong",
      });
    });
  }catch(err){
    console.error(err);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

exports.createExpense =async  (req, res, next) => {

  const { amount, description, category,token } = req.body;


  try {
  const verifyResult = jwt.verify(token, secret);
  const userId = verifyResult.userId;
   
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
    const isPremiumUser=user.isPremiumUser;

    // Step 4: Respond with a success message
    res.status(201).json({
      message: "Expense created and totalExpense updated successfully",
      expense: {
        amount: amount,
        description: description,
        category: category,
      },
      totalExpense: user.totalExpense,
      isPremiumUser:isPremiumUser
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
        const amount=expense.amount;
        expense.destroy();

        User.findByPk(expense.userId)
          .then((user) => {
            const totalExpense = parseFloat(user.totalExpense);
            const newAmount = parseFloat(amount);

            user.totalExpense = totalExpense - newAmount;
            user.save(); 
            res.status(200).json({ message: "Expense deleted successfully", isPremiumUser:user.isPremiumUser,totalExpense:user.totalExpense });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ message: "Something went wrong on Deletion of records" });
          })
       
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Something went wrong" });
    });
};
