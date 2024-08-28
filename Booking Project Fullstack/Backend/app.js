const express = require("express");
const UserBookings = require("./models/user");
const sequelize = require("./util/database");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());

app.use(bodyParser.json());

app.get("/", (req, res, next) => {
  UserBookings.findAll()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/", (req, res, next) => {
  res.send("Post Request received");
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;

  UserBookings.create({
    Name: name,
    Email: email,
    phoneNumber: phone,
  })
    .then((result) => {
      res.send("User created");
    })
    .catch((err) => {
      console.log(err);
    });

  
})


app.delete("/:id", (req, res, next) => {
  UserBookings.findByPk(req.params.id).then((user) => { 
    return user.destroy();

  }).catch((err) => {
    console.log(err);
  });
})


// app.put("/:id", (req, res, next) => {
//   UserBookings.findByPk(req.params.id).then((user) => {
//     user.Name = req.body.Name;
//     user.Email = req.body.Email;
//     user.phoneNumber = req.body.phoneNumber;
//     return user.save();
//   }).catch((err) => {
//     console.log(err); 
//   });
// })

sequelize
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
