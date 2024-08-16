const express = require('express');
const fs=require('fs');
const LocalStorage = require('node-localstorage').LocalStorage,
  localStorage = new LocalStorage('./scratch');

const router = express.Router();    

router.get("/",(req,res,next)=>{

  if(!fs.existsSync('./message.txt')){
    fs.writeFileSync('./message.txt','');
  }
  const chat=fs.readFileSync('./message.txt');
    res.send(`<h2>${chat}</h2>  <form action='/' method='POST' ><input type='text' name='message'><button type='submit'>Send</button></form>`); 
  })

  router.post("/",(req,res,next)=>{
    console.log(req.body);
    const username=localStorage.getItem('username');
    

    fs.appendFile('./message.txt',username+' : '+ req.body.message+" , ",(err)=>{
        if(err){
            console.log(err);
        }
    });
    res.redirect('/');    

  })

module.exports = router;