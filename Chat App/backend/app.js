require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
// const jwt = require("jsonwebtoken");
const sequelize = require("./utils/database");
const User = require("./model/User");
const Messages = require("./model/Messages");
const Group = require("./model/Group");
const signupRoute = require("./routes/authRoute");
const UserMsgRoute = require("./routes/UserMsgRoute");
const groupRoute = require("./routes/groupRoute");
const ArchivedChat = require("./model/ArchivedChat");
const { CronJob } = require("cron");
const { Op } = require("sequelize");
const axios = require("axios");
const path = require("path");
const { arch } = require("os");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

User.hasMany(Messages);
Messages.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

Group.hasMany(Messages);
Messages.belongsTo(Group, { constraints: true, onDelete: "CASCADE" });

User.belongsToMany(Group, { through: "UserGroups" });
Group.belongsToMany(User, { through: "UserGroups" });

app.use(express.static(path.join(__dirname, "public")));

app.use("/api", signupRoute);
app.use("/api", UserMsgRoute);
app.use("/api", groupRoute);

// Cron job runs at  every midnight

const archiveOldMessages = async () => {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const oldMessages = await Messages.findAll({
      where: {
        createdAt: {
          [Op.lt]: oneDayAgo,
        },
      },
    });

    if (oldMessages.length > 0) {
      await ArchivedChat.bulkCreate(
        oldMessages.map((msg) => ({
          message: msg.message,
          fileUrl: msg.fileUrl,
          groupId: msg.groupId,
          userId: msg.userId,
          createdAt: msg.createdAt,
        }))
      );

      await Messages.destroy({
        where: {
          createdAt: {
            [Op.lt]: oneDayAgo,
          },
        },
      });

      console.log(`Archived ${oldMessages.length} old messages.`);
    } else {
      console.log("No messages to archive.");
    }
  } catch (error) {
    console.error("Error during archiving messages:", error);
  }
};

const job = new CronJob("0 0 * * *", async () => {
  console.log("Starting the archiving process...");
  await archiveOldMessages();
});

job.start();

// Socket.IO Connection
io.on("connection", (socket) => {
  console.log(socket.id, " connected");

  socket.on("sendMessage", async (data) => {
    const { message, fileUrl, groupId } = data;

    const messageData = {
      message,
      fileUrl,
      groupId,
    };

    try {
      const response = await axios.post(
        "http://localhost:4000/api/user/message",
        messageData,
        {
          headers: {
            Authorization: `${data.token}`,
          },
        }
      );

      io.emit("receiveMessage", {
        message: message || "file message",
        fileUrl: fileUrl || null,
        senderName: response.data.senderName,
        userId: response.data.userId,
        groupId: groupId,
        createdAt: response.data.createdAt,
      });
    } catch (dbError) {
      console.error("Error saving message to the database:", dbError);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

sequelize
  .sync()
  .then(() => {
    server.listen(4000, () => {
      console.log("Server is running on port 4000");
    });
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = app;
