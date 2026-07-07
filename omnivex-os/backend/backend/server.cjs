const express = require("express");
const cors = require("cors");

const Cerberus = require("./core/cerberus");
const Mercury = require("./core/mercury/mercury");
const Aegis = require("./core/aegis/riskGovernor");
const Chronicle = require("./core/chronicle/chronicle");

const app = express();

app.use(cors());
app.use(express.json());

// CORE SYSTEMS
const mercury = new Mercury();
const aegis = new Aegis();
const chronicle = new Chronicle();

// ORGANISM CORE
const cerberus = new Cerberus({
  mercury,
  aegis,
  chronicle,
});

// SAFE CYCLE LOOP
setInterval(async () => {
  try {
    await cerberus.tick();
  } catch (e) {
    console.error("[OMNIVEX LOOP ERROR]", e.message);
  }
}, 2000);

// HEALTH
app.get("/health", (req, res) => {
  res.json({
    system: "OMNIVEX_KERNEL_LIVE",
    status: "RUNNING",
    time: Date.now(),
  });
});

// CERBERUS FEED
app.get("/cerberus", (req, res) => {
  res.json({
    system: "CERBERUS",
    timestamp: Date.now(),
    data: cerberus.getCerberusSignals(),
  });
});

app.listen(3000, () => {
  console.log("==================================");
  console.log("🚀 OMNIVEX OS ONLINE");
  console.log("SYSTEM: OMNIVEX_KERNEL_LIVE");
  console.log("MODE: REAL EXCHANGE + INTELLIGENCE");
  console.log("==================================");
  console.log("🚀 OMNIVEX KERNEL RUNNING ON 3000");
  console.log("==================================");
});
