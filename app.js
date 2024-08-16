const express = require('express');
const bodyParser = require('body-parser');


const app=express();


app.use(bodyParser.urlencoded({extended:false}));

app.get('/add-product',(req,res,next)=>{
  res.send("<form action='/product' method='POST' >Name:<input type='text' name='product'>Size: <input type='number' name='size'/><button type='submit'>Add Product</button></form>");
})

app.post('/product',(req,res,next)=>{
  console.log(req.body);
  res.redirect('/');      
})


app.use((req,res,next)=>{
  res.send("<h1>Hello from Express</h1>") 
})



app.listen(3000)