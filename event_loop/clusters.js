// example cluster with 6 workers

const cluster = require("cluster");
const http = require("http");
const NUM_WORKERS = 6;
const counter = {};

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < NUM_WORKERS; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  http
    .createServer((req, res) => {
      res.writeHead(200);
      if (counter[process.pid]) {
        counter[process.pid] += 1;
      } else {
        counter[process.pid] = 1;
      }
      console.log(`${process.pid}: ${counter[process.pid]}`);
      res.end(
        `hello number ${counter[process.pid]} from ${
          process.pid
        }\ntotal: ${JSON.stringify(counter)}`
      );
    })
    .listen(8000);

  console.log(`Worker ${process.pid} started`);
}
