const Sequelize = require("sequelize");
const User = require("../models/User");
const Expense = require("../models/Expense");
const { uploadToS3 } = require("../services/aws_s3_service");
const filesUploaded = require("../models/filesUploaded");

exports.getLeaderboard = async (req, res, next) => {
  try {
    const isPremium = req.user.dataValues.isPremiumUser;
    

    if (isPremium == false) {
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


exports.downloadExpenses = async (req, res, next) => {  

  try{

    const isPremium = req.user.dataValues.isPremiumUser;
  

    if (!isPremium) {
      return res.json({
        success: false,
        message: "You are not a premium user. Please upgrade to premium to access this feature.",
      });
    }else{

    const expenses = await Expense.findAll({ where: { userId: req.user.id } });
    const  strigifiedExpenses = JSON.stringify(expenses); 

    const userId = req.user.id;

    const fileName = `Expenses_${userId}/${new Date()}.txt`; 
  

     const fileUrl=await uploadToS3(fileName,strigifiedExpenses);

    filesUploaded.create({
      userId: userId,
      url: fileUrl,
    });

     res.status(200).json({
      success: true,
      message: "Expenses downloaded successfully",
      fileUrl: fileUrl,
    });
  
    }
  }catch(err){
    console.error("Error downloading expenses:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }

}


exports.downloadHistory = async (req, res, next) => {

  try{

    const isPremium = req.user.dataValues.isPremiumUser;
  
    if (!isPremium) {
      return res.json({
        success: false,
        message: "You are not a premium user. Please upgrade to premium to access this feature.",
      });
    }else{

    const files = await filesUploaded.findAll({ where: { userId: req.user.id } });

     res.status(200).json({
      success: true,
      message: "Uploaded File Links Sent Successfully",
      files: files,
    });
  
    }
  }catch(err){
    console.error("Error downloading history:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

exports.downloadExpensesByTime = async (req, res, next) => {
      
   const time=req.params.time;

    


}