const http = require("http"),
  config = require("dotenv"),
  path = require("path"),
  express = require("express"),
  fs = require("fs"),
  WebSocket = require("ws"),
  app = express(),
  server = http.createServer(app),
  websocketServer = new WebSocket.Server({ server });

config.config();

const port = process.env.PORT || 3000;

function stringToArrayBuffer(string) {
  var buffer = new ArrayBuffer(string.length);
  var bufferView = new Uint8Array(buffer);
  for (var i = 0; i < string.length; i++) {
    bufferView[i] = string.charCodeAt(i);
  }
  return bufferView;
}

app.get("/:filename", function (req, res) {
  const { filename } = req.params;
  res.sendFile(path.join(`${__dirname}/${filename}`));
});

websocketServer.on("connection", (webSocketClient) => {
  console.log("Connection accepted");
  webSocketClient.on("message", (message) => {
    const json = JSON.parse(message);
    const rawData = stringToArrayBuffer(json.data);
    let writeStream = fs.createWriteStream(json.filename);
    writeStream.write(rawData, "base64");
    writeStream.on("finish", () => {
      console.log("wrote data to file");
    });
    writeStream.end();
    websocketServer.clients.forEach((client) => {
      client.send(json.filename);
    });
  });
});

server.listen(port, () => {
  console.log(`Websocket server started on port ` + port);
});
