const Sequelize = require('sequelize');

const sequelize=new Sequelize ('meeting-scheduler','root','sami@sql',{dialect:'mysql',host:'localhost'});

module.exports = sequelize;