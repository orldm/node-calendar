// util for calling localhost 100 times
const http = require("http");

for (i = 0; i < 100; i++) {
  http.get("http://localhost:8000");
}
