const fs=require('fs');

const requestHandler = (req,res)=>{
    
    if(req.url==="/"){

        fs.readFile("message.txt","utf8",(err,data)=>{ 
              if(err){
                  console.log(err)
                  return res.end();
              }
 
           
         res.setHeader('Content-Type','text/html');
         res.write('<html>');
         res.write('<head><title>Enter Message</title/><head>')
         res.write(`<h1>${data}</h1>`)
         res.write('<body><form action="/message" method="POST"  ><input type="text" name="message" /><button>Send</button></form></body>')
         res.write('</html>')
         return res.end()
     })
     }
 
 
 
 
     if(req.url==="/message" && req.method==="POST"){
 
         const body=[];
         req.on("data",(chunk)=>{
            body.push(chunk);
         })
 
         req.on("end",()=>{
             const parsedBody=Buffer.concat(body).toString();
             const message=parsedBody.split("=")[1];
             fs.writeFileSync('message.txt',message);
         })
         
         res.statusCode=302;
         res.setHeader('Location','/');
         return res.end()
     }
}

module.exports=requestHandler;