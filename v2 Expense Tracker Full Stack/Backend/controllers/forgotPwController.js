const User = require("../models/User");
const uuid = require("uuid");
const forgotPasswords = require("../models/forgotPasswords");
const bcrypt = require("bcrypt");

exports.sendResetLink = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
   
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

  
    const resetToken = uuid.v4();

    await forgotPasswords.create({
      userId: user.id,
      id: resetToken,
      isActive: true,  
    });

  
    res.status(200).json({ message: "Reset link sent",resetToken});

  } catch (err) {
    console.error("Error sending reset link:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};


exports.resetPassword = async (req, res, next) => {
 
    try {
        const { password, resetToken } = req.body;
    
        const resetPassword = await forgotPasswords.findOne({ where: { id: resetToken } });
    
        if (!resetPassword) {
        return res.status(404).json({ message: "Invalid reset link" });
        }
    
        if (!resetPassword.isActive) {
        return res.status(403).json({ message: "Reset link expired" });
        }
    
        const user = await User.findByPk(resetPassword.userId);
    
        if (!user) {
        return res.status(404).json({ message: "User not found" });
        }
    
        const hashedPassword = await bcrypt.hash(password, 12);
        user.password = hashedPassword;
        await user.save();
    
        resetPassword.isActive = false;
        await resetPassword.save();
    
        res.status(200).json({ message: "Password reset successfully" });
    
    } catch (err) {
        console.error("Error resetting password:", err);
        res.status(500).json({ message: "Something went wrong" });
    }
}