const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  isPremiumUser: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  totalExpense:{
    type: Sequelize.INTEGER,
    defaultValue: 0 
  }
});

module.exports = User;
