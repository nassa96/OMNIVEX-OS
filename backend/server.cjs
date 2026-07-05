const http = require("http");

let equity = 1000;

setInterval(() => {
  equity += (Math.random() - 0.5) * 2;
}, 1000);

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });

    res.end(JSON.stringify({
      status: "OK",
      runtime: "CANONICAL_V1",
      equity,
      chronicle: true,
      sophia: true,
      elohim: true,
      saint: true,
      decision: {
        action: equity > 1000 ? "SCALE_UP" : "HOLD",
        confidence: 0.75
      }
    }));
    return;
  }

  res.writeHead(404);
  res.end("NOT FOUND");
});

server.listen(3000, () => {
  console.log("CANONICAL RUNTIME ONLINE ON PORT 3000");
});
