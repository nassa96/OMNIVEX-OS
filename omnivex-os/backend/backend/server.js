app.get("/pnl", (req, res) => {
  res.json(chronicle.getPnL());
});
