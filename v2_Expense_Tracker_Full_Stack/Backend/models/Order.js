const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Order = sequelize.define("order", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  paymentId: {
    type: Sequelize.STRING,
    allowNull: true 
  },
  orderId: {
    type: Sequelize.STRING,
  
  },
  status: {
    type: Sequelize.STRING,

  },
});

module.exports = Order;
