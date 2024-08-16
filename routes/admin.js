const express = require('express');
 
const router = express.Router();

router.get('/add-product',(req,res,next)=>{
    res.send("<form action='/admin/add-product' method='POST' >Name:<input type='text' name='product'>Size: <input type='number' name='size'/><button type='submit'>Add Product</button></form>");
  })
  
router.post('/add-product',(req,res,next)=>{
    console.log(req.body);
    res.redirect('/shop');      
  })
  

module.exports = router;