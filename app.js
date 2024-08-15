const http=require('http');

const routes=require('./routes');


const server = http.createServer(routes)



server.listen(4000,'0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:4000/`);
});