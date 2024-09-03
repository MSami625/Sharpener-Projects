const sequelize = require("../util/database");
const Sequelize=require('sequelize');


const forgotPasswords=sequelize.define('forgotPasswords',{
    id:{
        type:Sequelize.STRING,
        allowNull:false,
        primaryKey:true
    },
    userId:{
        type:Sequelize.INTEGER,
        allowNull:true
    },
    isActive:{
        type:Sequelize.BOOLEAN,
        allowNull:true
    },            
})

module.exports=forgotPasswords;