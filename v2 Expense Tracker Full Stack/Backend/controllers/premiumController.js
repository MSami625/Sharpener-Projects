const Sequelize = require("sequelize");
const User = require("../models/User");
const Expense = require("../models/Expense");

exports.getLeaderboard = async (req, res, next) => {
  try {
    const isPremium = req.user.isPremium;

    if (isPremium == true) {
      return res.status(403).json({
        success: false,
        message:
          "You are not a premium user. Please upgrade to premium to access this feature.",
      });
    }

    const leaderboard = await User.findAll({
      attributes: ["name", "totalExpense"],
      order: [["totalExpense", "DESC"]],
      limit: 5,
    });

    const result = leaderboard.map((user) => ({
      userName: user.name,
      totalExpenses: user.totalExpense,
    }));

    res.status(200).json({
      success: true,
      leaderboard: result,
      user: req.user.name,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};