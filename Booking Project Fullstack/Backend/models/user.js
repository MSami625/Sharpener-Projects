const Sequelize=require('sequelize');
const sequelize=require('../util/database');


const UserBookings=sequelize.define('userBookings',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    }
,
    Name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    Email:{
        type:Sequelize.STRING,
        allowNull:false
    },
    phoneNumber:{
        type:Sequelize.STRING,
        allowNull:false
    }


},

{
    timestamps: true, // Ensures createdAt and updatedAt columns are managed
  }
)

module.exports=UserBookings;