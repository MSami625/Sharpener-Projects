const express = require('express');
const bodyParser = require('body-parser');
const path=require('path');

const adminRoutes=require('./routes/admin');
const ShopRoutes=require('./routes/shop');  
const ContactUsRoutes=require('./routes/contact-us');
const errorController=require('./controllers/404');


const app=express();



app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));

app.use("/admin",adminRoutes);

app.use(ShopRoutes);

app.use(ContactUsRoutes);


app.use(errorController.error);



app.listen(3000)