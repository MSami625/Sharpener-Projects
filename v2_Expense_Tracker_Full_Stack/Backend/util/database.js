const Sequelize = require('sequelize');

const sequelize=new Sequelize ('expense-tracker-v2','root','sami@sql',{dialect:'mysql',host:'localhost'});

module.exports = sequelize;