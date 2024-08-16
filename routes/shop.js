const express = require('express');



const router = express.Router();    

const rootDir=require('../util/path');

router.get("/",(req,res,next)=>{
  res.sendFile(rootDir+'/views/shop.html'); 
})



module.exports = router;