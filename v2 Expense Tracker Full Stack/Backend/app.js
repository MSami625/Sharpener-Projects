const express = require("express");
const sequelize = require("./util/database");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoute = require("./routes/authRoute");

const app = express();
app.use(cors());
app.use(bodyParser.json());



app.use('/',authRoute);

sequelize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err);
  });
app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
