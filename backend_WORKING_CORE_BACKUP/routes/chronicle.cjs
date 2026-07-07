const express = require("express");
const router = express.Router();
const chronicle = require("../core/chronicle/chronicle.cjs");

/**
 * GET FULL EVENT HISTORY
 */
router.get("/all", (req, res) => {
  res.json({
    total: chronicle.events.length,
    data: chronicle.events
  });
});

/**
 * FILTER BY TYPE (SIGNAL | EXECUTION | RISK | REJECT)
 */
router.get("/type/:type", (req, res) => {
  const type = req.params.type.toUpperCase();

  const filtered = chronicle.replay(e => e.type === type);

  res.json({
    type,
    count: filtered.length,
    data: filtered
  });
});

/**
 * SYSTEM SNAPSHOT
 */
router.get("/snapshot", (req, res) => {
  res.json(chronicle.snapshot());
});

module.exports = router;
