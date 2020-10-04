const http = require("http");
const logger = require("./logger");
const config = require("./config");

http
  .createServer((req, res) => {
    logger.log("New incoming request");
    res.writeHeader(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "hello world" }));
  })
  .listen(config.PORT, () => logger.log(`listening on port ${config.PORT}`));
