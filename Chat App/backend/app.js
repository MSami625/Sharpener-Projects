const express = require("express");
const User = require("./model/User");
const sequelize = require("./utils/database");
const signupRoute = require("./routes/signupRoute");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
  })
);
app.use(express.json());

app.use("/api", signupRoute);

sequelize
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
