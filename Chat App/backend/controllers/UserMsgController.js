const User = require("../model/User");
const Messages = require("../model/Messages");
const { Op } = require("sequelize");
const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { v4: uuidv4 } = require("uuid");
const ArchivedChat = require("../model/ArchivedChat");

// Configure AWS S3
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "ap-south-1",
});

const s3 = new AWS.S3();

const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.postUserMsg = async (req, res) => {
  try {
    const { message, groupId, fileUrl } = req.body;

    if (!groupId) {
      return res.status(400).json({ message: "Group Id is required" });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isStored = await Messages.create({
      message,
      userId: req.user.id,
      senderName: req.user.name,
      groupId,
      fileUrl,
    });

    return res.status(201).json({
      message: "Message saved successfully",
      userId: req.user.id,
      senderName: req.user.name,
      createdAt: isStored.createdAt,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAllMessages = async (req, res) => {
  try {
    const MAX_MESSAGES = 10;
    const groupId = req.query.groupId;

    if (!groupId) {
      return res.status(400).json({ message: "Group Id is required" });
    }

    const page = parseInt(req.query.page, 10) || 1;
    if (page < 1) {
      return res.status(400).json({ message: "Page must be greater than 0" });
    }

    const offset = (page - 1) * MAX_MESSAGES;

    const currentMessages = await Messages.findAll({
      where: { groupId },
      order: [["createdAt", "DESC"]],
      limit: MAX_MESSAGES,
      offset: offset,
    });

    const archivedMessages = await ArchivedChat.findAll({
      where: { groupId },
      order: [["createdAt", "DESC"]],
      limit: MAX_MESSAGES,
      offset: offset,
    });

    const combinedMessages = [...currentMessages, ...archivedMessages];

    return res.status(200).json({ messages: combinedMessages });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const search = req.query.name;

    if (!search) {
      return res.status(400).json({ message: "Search Query is required" });
    }

    const users = await User.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { phoneNumber: { [Op.like]: `%${search}%` } },
        ],
      },
    });

    return res.status(200).json({ users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.uploadFile = [
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const fileName = `uploads/${uuidv4()}-${req.file.originalname}`;
      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: fileName,
        Body: req.file.buffer,
        ACL: "public-read",
      };

      // Upload to S3
      s3.upload(params, (err, data) => {
        if (err) {
          console.error("Error uploading file:", err);
          return res.status(500).json({ message: "Error uploading file" });
        }

        return res.status(201).json({
          message: "File uploaded successfully",
          fileUrl: data.Location,
        });
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      return res
        .status(500)
        .json({ message: "Error uploading file", error: error.message });
    }
  },
];
