const express = require('express');
 
const router = express.Router();

const LocalStorage = require('node-localstorage').LocalStorage,
  localStorage = new LocalStorage('./scratch');

router.get('/login',(req,res,next)=>{
    res.send("<form action='/login' method='POST' >Name:<input type='text' name='username'><button type='submit'>Login</button></form>");
  })
  
router.post('/login',(req,res,next)=>{
    
    localStorage.setItem('username',req.body.username);  
    res.redirect('/');      
  })
  

module.exports = router;