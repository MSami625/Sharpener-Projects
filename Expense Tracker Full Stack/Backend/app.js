const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const sequelize = require("./util/database");
const Sequelize = require("sequelize");
const Expenses = require("./models/expense");

const app = express();
app.use(cors());
app.use(bodyParser.json());



app.get("/expenses", (req, res) => {
    Expenses.findAll().then((result) => {
        res.json(result);
        console.log("get re")
    }).catch((err) => {
        console.log(err);
    })  
})


app.post("/", (req, res) => {
  const amount = req.body.amount;
  const description = req.body.description;
  const category = req.body.category;

  Expenses.create({
    amount: amount,
    description: description,
    category: category,
  })
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.delete("/expenses/:id", (req, res) => {
    const id = req.params.id;
    Expenses.findByPk(id)
        .then((expense) => {
        return expense.destroy();
        })
        .then((result) => {
        console.log("Deleted");
        })
        .catch((err) => {
        console.log(err);
        });
})



sequelize.sync().then((result) => {
  console.log(result);
  app.listen(3001, () => {
    console.log("Server is running on port 3001");
  });
}).catch((err) => {
    console.log(err);
})




