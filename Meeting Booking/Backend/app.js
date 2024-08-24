const express = require("express");
const sequelize = require("./util/database");
const bodyParser = require("body-parser");
const cors = require("cors");
const Slots = require("./models/slots");
const Meets = require("./models/meets");
const slotRoute = require("./routes/slotRoute");
const meetRoute = require("./routes/meetRoute");

const app = express();
app.use(cors());
app.use(bodyParser.json());

Slots.hasMany(Meets);
Meets.belongsTo(Slots, { constraints: true, onDelete: "CASCADE" });

app.use(slotRoute);

app.use(meetRoute);

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
