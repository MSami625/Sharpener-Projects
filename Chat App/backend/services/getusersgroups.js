const User = require("../model/User");
const Group = require("../model/Group");

exports.getUserGroups = async (userId) => {
  try {
    const user = await User.findByPk(userId, {
      include: [{ model: Group, as: "usergroups" }],
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user.groups;
  } catch (error) {
    console.error("Error fetching user groups:", error);
    throw error;
  }
};
