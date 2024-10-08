const sequelize = require('../util/database');
const Sequelize = require('sequelize');


const Expenses = sequelize.define('expenses', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    amount:{
        type: Sequelize.STRING,
        allowNull: false
    },
    description:{
        type: Sequelize.STRING,
        allowNull: false
    },
    category:{
        type: Sequelize.STRING,
        allowNull:false
    }

})

module.exports=Expenses;