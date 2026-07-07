const express = require("express");

const app = express();

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    system: "CANONICAL_RUNTIME",
    time: Date.now()
  });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`HTTP SERVER ONLINE ON PORT ${PORT}`);
});
