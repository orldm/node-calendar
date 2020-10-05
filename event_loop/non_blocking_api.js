// server with non-blocking api
// requests can be executed in parallel
const cluster = require("cluster");
const http = require("http");
const util = require("./util");
const numCPUs = require("os").cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  http
    .createServer((req, res) => {
      res.writeHead(200);
      res.end(`hello from ${process.pid}\n`);
      util.repeat(1000);
    })
    .listen(8000);

  console.log(`Worker ${process.pid} started`);
}
