dotenv = require("dotenv").config();
const express = require("express");
const User = require("./model/User");
const sequelize = require("./utils/database");
const signupRoute = require("./routes/authRoute");
const cors = require("cors");
const Messages = require("./model/Messages");
const UserMsgRoute = require("./routes/UserMsgRoute");
const Group = require("./model/Group");
const groupRoute = require("./routes/groupRoute");

const app = express();
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
  })
);
app.use(express.json());

User.hasMany(Messages);
Messages.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

Group.hasMany(Messages);
Messages.belongsTo(Group, { constraints: true, onDelete: "CASCADE" });

User.belongsToMany(Group, { through: "UserGroups" });
Group.belongsToMany(User, { through: "UserGroups" });

app.use("/api", signupRoute);
app.use("/api", UserMsgRoute);
app.use("/api", groupRoute);

sequelize
  // .sync({ force: true })
  .sync()
  .then((res) => {
    console.log(res);
    app.listen(4000, () => {
      console.log("Server is running on port 4000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
