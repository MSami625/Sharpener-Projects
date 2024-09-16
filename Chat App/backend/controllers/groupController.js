const User = require("../model/User");
const Group = require("../model/Group");

exports.createGroup = async (req, res) => {
  try {
    const { groupName, groupDescription } = req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const group = await Group.create({
      groupName,
      groupDescription,
      groupAdmin: req.user.id,
    });

    if (!group) {
      return res
        .status(400)
        .json({ message: "Some error occured while creating the group" });
    }

    await user.addGroup(group);

    return res.status(201).json({ message: "Group created successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getGroups = async (req, res) => {};
