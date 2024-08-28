const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const expenseRoutes = require("./routes/expensesRoute");

const sequelize = require("./util/database");

const app = express();
app.use(cors());
app.use(bodyParser.json());



app.use("/",expenseRoutes)



sequelize.sync().then((result) => {
  console.log(result);
  app.listen(3001, () => {
    console.log("Server is running on port 3001");
  });
}).catch((err) => {
    console.log(err);
})




