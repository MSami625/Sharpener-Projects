const Sequelize=require('sequelize');
const sequelize=require('../util/database');


const Slots=sequelize.define('slots',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    }
,
    time:{
        type:Sequelize.STRING,
        allowNull:false
    },
    count:{
        type:Sequelize.INTEGER,
        allowNull:false
    }

}
)

module.exports=Slots;