const http = require("http");

const server = http.createServer((req, res) => {
  console.log("sami");
    res.end("Hello World");
});

server.listen(4000);
