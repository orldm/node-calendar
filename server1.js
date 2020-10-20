const http = require("http");
const logger = require("./logger");
const config = require("./config");

function writeHeader(res, code) {
  return res.writeHeader(code, { "Content-Type": "application/json" });
}

http
  .createServer((req, res) => {
    const { url, method } = req;
    const regex = /^\/users\/(\d+$)/;
    if (url === "/") {
      writeHeader(res, 200);
      res.end(JSON.stringify({ message: "main route" }));
    } else if (url === "/users") {
      if (method === "GET") {
        writeHeader(res, 200);
        res.end(JSON.stringify({ message: "getting list of users" }));
      } else if (method === "POST") {
        writeHeader(res, 200);
        res.end(JSON.stringify({ message: "new user created" }));
      } else {
        writeHeader(res, 405);
        res.end(JSON.stringify({ message: "method not allowed" }));
      }
    } else if (url.match(regex) && method === "GET") {
      writeHeader(res, 200);
      res.end(
        JSON.stringify({
          message: `getting user with id ${url.match(regex)[1]}`,
        })
      );
    } else {
      writeHeader(res, 404);
      res.end(JSON.stringify({ message: "not found" }));
    }
  })
  .listen(config.PORT, () => logger.log(`listening on port ${config.PORT}`));
