require('dotenv').config();
const express = require("express");
const sequelize = require("./util/database");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoute = require("./routes/authRoute");
const expensesRoute = require("./routes/expensesRoute");
const Expense = require("./models/Expense");  
const User = require("./models/User");
const Order = require("./models/Order");
const paymentRoute = require("./routes/purchasePremiumRoute");
const premiumRoute = require("./routes/premiumRoute");
const forgotPwRoute = require("./routes/forgotPwRoute");
const filesUploaded = require("./models/filesUploaded");



const app = express();
app.use(cors());
app.use(express.json());



User.hasMany(Expense);
Expense.belongsTo(User,{ constraints: true, onDelete: "CASCADE" });
User.hasMany(Order);
Order.belongsTo(User,{ constraints: true, onDelete: "CASCADE" }); 
User.hasMany(filesUploaded);
filesUploaded.belongsTo(User,{ constraints: true, onDelete: "CASCADE" });


app.use('/',authRoute);
app.use('/',expensesRoute);
app.use('/',paymentRoute);
app.use('/',premiumRoute)
app.use('/',forgotPwRoute);




sequelize
  // .sync({ alter: true })
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
