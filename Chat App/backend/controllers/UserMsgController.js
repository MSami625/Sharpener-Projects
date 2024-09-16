const User = require("../model/User");
const Messages = require("../model/Messages");

exports.postUserMsg = async (req, res) => {
  try {
    const { message } = req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(req.user.name);
    const isStored = await Messages.create({
      message,
      userId: req.user.id,
      senderName: req.user.name,
    });

    if (!isStored) {
      return res
        .status(400)
        .json({ message: "Some error occured while saving the message" });
    }

    return res.status(201).json({ message: "Message saved successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAllMessages = async (req, res) => {
  try {
    let MAX_MESSAGES = 10;

    const page = parseInt(req.query.page, 10) || 1;
    if (page < 1) {
      return res.status(400).json({ message: "Page must be greater than 0" });
    }

    const offset = (page - 1) * MAX_MESSAGES;

    let messages = await Messages.findAll({
      order: [["createdAt", "DESC"]],
      limit: MAX_MESSAGES,
      offset: offset,
    });

    if (!messages) {
      return res.status(404).json({ message: "No messages found" });
    }

    return res.status(200).json({ messages });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
