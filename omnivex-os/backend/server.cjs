const express = require("express");
const http = require("http");

const { getCerberusSignals } = require("./core/cerberus");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

/**
 * SYSTEM BOOT
 */
console.log("==================================");
console.log("🚀 OMNIVEX OS ONLINE");
console.log("SYSTEM: OMNIVEX_KERNEL_LIVE");
console.log("MODE: REAL EXCHANGE + INTELLIGENCE");
console.log("==================================");

/**
 * HEALTH CHECK
 */
app.get("/health", (req, res) => {
  res.json({
    system: "OMNIVEX_KERNEL_LIVE",
    status: "ONLINE",
    time: Date.now()
  });
});

/**
 * CERBERUS SIGNAL ENDPOINT
 */
app.get("/cerberus", (req, res) => {
  try {
    const signals = getCerberusSignals();

    res.json({
      system: "CERBERUS",
      ...signals
    });
  } catch (err) {
    console.error("[CERBERUS ERROR]", err.message);
    res.status(500).json({
      error: "CERBERUS_FAILURE",
      message: err.message
    });
  }
});

/**
 * START SERVER
 */
server.listen(PORT, () => {
  console.log("==================================");
  console.log(`🚀 OMNIVEX KERNEL RUNNING ON ${PORT}`);
  console.log("==================================");
});
