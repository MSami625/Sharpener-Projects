const Sequelize = require("sequelize");

const sequelize = new Sequelize("chatapp", "root", "sami@sql", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
