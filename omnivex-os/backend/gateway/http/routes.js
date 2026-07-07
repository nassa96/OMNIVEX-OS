export function registerRoutes(app, bus, gateway) {

  // CORE HEALTH ENDPOINT
  app.get("/health", (req, res) => {
    res.json({
      system: "OMNIVEX_OS",
      gateway: gateway.health(),
      timestamp: Date.now()
    });
  });

  // EVENT DEBUG STREAM
  app.get("/events", (req, res) => {
    res.json({
      status: "ACTIVE",
      message: "Event stream is internal via WS bridge"
    });
  });

  // SIMPLE MARKET PING (for frontend sync test)
  app.get("/ping", (req, res) => {
    bus.emit("system.ping", {
      source: "http",
      ts: Date.now()
    });

    res.json({ ok: true });
  });
}
