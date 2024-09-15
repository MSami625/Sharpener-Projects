dotenv = require("dotenv").config();
const express = require("express");
const User = require("./model/User");
const sequelize = require("./utils/database");
const signupRoute = require("./routes/authRoute");
const cors = require("cors");
const Messages = require("./model/Messages");
const UserMsgRoute = require("./routes/UserMsgRoute");

const app = express();
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
  })
);
app.use(express.json());

User.hasMany(Messages);
Messages.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

app.use("/api", signupRoute);
app.use("/api", UserMsgRoute);

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
