const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'sami@sql', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
