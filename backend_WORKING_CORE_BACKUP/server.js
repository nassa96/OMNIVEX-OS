const express = require("express");
const http = require("http");

const app = express();

app.use(express.json());

// =========================
// HEALTH
// =========================
app.get("/health", (req, res) => {
  res.json({
    system: "SAINT_PRIME",
    status: "ONLINE",
    time: Date.now()
  });
});

// =========================
// CHRONICLE ROUTE
// =========================
try {
  const chronicleRoute = require("./routes/chronicle.cjs");
  app.use("/chronicle", chronicleRoute);
  console.log("[ROUTE] CHRONICLE ONLINE");
} catch (err) {
  console.log("[ROUTE] CHRONICLE OFFLINE:", err.message);
}

// =========================
// HTTP SERVER
// =========================
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`[HTTP] SAINT PRIME ONLINE http://localhost:${PORT}`);
});

module.exports = {
  app,
  server
};
