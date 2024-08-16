const express = require('express');

const router = express.Router();
const rootDir=require('../util/path');

router.get("/contact-us",(req,res,next)=>{    
    res.sendFile(rootDir+'/views/contact-us.html');
})

router.post("/contact-us",(req,res,next)=>{   
    console.log(req.body);
    res.redirect("/success");

})


router.get("/success",(req,res,next)=>{  
    res.send("<h1>Form Submitted Successfully</h1><a href='/contact-us'>Go Back</a>");  
})
module.exports = router;