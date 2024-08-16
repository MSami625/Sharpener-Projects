const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes=require('./routes/login');
const ShopRoutes=require('./routes/home');  


const app=express();

app.use(bodyParser.urlencoded({extended:false}));


app.use(adminRoutes);

app.use(ShopRoutes);



app.use((req,res,next)=>{
    res.status(404).send("<h1>Page Not Found</h1>");
})



app.listen(3000)