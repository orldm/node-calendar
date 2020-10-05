// server with blocking api
// request is blocked until previous request is executed
const http = require("http");
const util = require("./util");

http
  .createServer((req, res) => {
    res.writeHead(200);
    res.end(`hello from ${process.pid}\n`);
    util.repeat(1000);
  })
  .listen(8000);
