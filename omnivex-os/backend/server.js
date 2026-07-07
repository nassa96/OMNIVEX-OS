const express = require("express");
const cors = require("cors");
const http = require("http");
const { WebSocketServer } = require("ws");

const Mercury = require("./core/mercury");
const Cerberus = require("./core/cerberus");
const Sophia = require("./core/sophia");
const Tartarus = require("./core/tartarus");
const Forge = require("./core/forge");
const Chronicle = require("./core/chronicle");
const WarEngine = require("./core/war");
const Elohim = require("./core/elohim");
const Saint = require("./core/saint");
const Aegis = require("./core/aegis");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// CORE
const mercury = new Mercury();
const chronicle = new Chronicle();
const forge = new Forge();

const cerberus = new Cerberus(mercury, chronicle);
const sophia = new Sophia();
const tartarus = new Tartarus();

const war = new WarEngine(forge);
const elohim = new Elohim(forge);
const saint = new Saint(forge, chronicle);
const aegis = new Aegis(forge);

function broadcast(data) {
  const msg = JSON.stringify(data);
  wss.clients.forEach(c => {
    if (c.readyState === 1) c.send(msg);
  });
}

// =====================
// COSMIC PIPELINE
// =====================
async function loop() {
  try {
    const market = await mercury.scan();

    const cer = await cerberus.tick(market);
    const sop = sophia.analyze(market);
    const tar = tartarus.disrupt(market);

    const merged = [...cer, ...sop, ...tar];

    const warResult = war.resolve(merged);
    const elohimDecision = elohim.evaluate(warResult);

    const aegisDecision = aegis.evaluate(elohimDecision, saint);

    const saintResult = saint.execute(
      elohimDecision,
      market,
      aegisDecision
    );

    const leaderboard = forge.leaderboard();

    chronicle.write({
      type: "COSMIC_TICK",
      war: warResult,
      elohim: elohimDecision,
      aegis: aegisDecision,
      saint: saintResult,
      leaderboard,
      ts: Date.now()
    });

    broadcast({
      type: "COSMIC_STATE",
      war: warResult,
      elohim: elohimDecision,
      aegis: aegisDecision,
      saint: saintResult,
      leaderboard
    });

    console.log(
      "[COSMIC]",
      "risk:",
      aegisDecision.riskScore.toFixed(3),
      "| blocked:",
      saintResult.blocked
    );

  } catch (e) {
    console.error("[COSMIC ERROR]", e.message);
  }
}

setInterval(loop, 3000);

// =====================
// API
// =====================
app.get("/health", (req, res) => {
  res.json({
    system: "OMNIVEX_COSMIC_GOVERNED",
    status: "ONLINE",
    layers: ["WAR", "ELOHIM", "AEGIS", "SAINT"]
  });
});

app.get("/leaderboard", (req, res) => {
  res.json(forge.leaderboard());
});

app.get("/chronicle", (req, res) => {
  res.json(chronicle.get());
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log("==================================");
  console.log(" OMNIVEX COSMIC GOVERNED ENGINE");
  console.log(" WAR → ELOHIM → AEGIS → SAINT");
  console.log(" PORT:", PORT);
  console.log("==================================");
});
