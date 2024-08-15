const http = require("http");

const server = http.createServer((req, res) => {
 
  if (req.url === "/home") {
  
    res.write("<html>");
    res.write("<head><title>Home</title></head>");
    res.write("<body><h1>Welcome to Home Page</h1></body>");
    res.write("</html>");
    return res.end();
  }

  if (req.url === "/about") {
    res.write("<html>");
    res.write("<head><title>About</title></head>");
    res.write("<body><h1>Welcome to About Page</h1></body>");
    res.write("</html>");
    return res.end();
  }

  if (req.url === "/node") {
    res.write("<html>");
    res.write("<head><title>Node</title></head>");
    res.write("<body><h1>Welcome to Node Page</h1></body>");
    res.write("</html>");
    return res.end();
  }
});

server.listen(4000);
