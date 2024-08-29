// Version: 1.0
const User = require('../models/user');

exports.signUp=(req,res,next)=>{
    const {name,email,password}=req.body;
    
    User.findOne({where:{email}})
    .then(user=>{
        if(user){
            res.status(400).json({message:"User already exists"})
        }else{
            User.create({name,email,password})
            .then(user=>{
                res.status(201).json({message:"User created successfully",user})
            })
        }
    }).catch(err=>{
        res.status(500).json({message:"Internal Server Error"})
        console.log(err);
    })  

}

exports.login=(req,res,next)=>{
   const {email,password} =req.body;

   User.findOne({where:{email}})
   .then(user=>{
          if(!user){
            return res.status(404).json({message:"User does not exist"})
          }
         if(user.password!==password){
            return res.status(400).json({message:"Wrong Password"});
          }
          
          
          //found user
          return res.status(200).json({message:"User logged in successfully"}) 
   })
     
  .catch(err=>{
       res.status(500).json({message:"Internal Server Error"})
       console.log(err);
   })

}