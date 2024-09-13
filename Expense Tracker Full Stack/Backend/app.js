const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const expenseRoutes = require("./routes/expensesRoute");

const sequelize = require("./util/database");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/", expenseRoutes);

sequelize
  .sync()
  .then((result) => {
    console.log(result);
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
