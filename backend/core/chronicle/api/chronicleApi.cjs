const chronicle = require("../chronicle.cjs");

class ChronicleApi {
  register(app) {
    app.get("/chronicle/latest", (req, res) => {
      res.json({
        status: "ok",
        data: chronicle.getLatest(100)
      });
    });

    app.get("/chronicle/all", (req, res) => {
      res.json({
        status: "ok",
        data: chronicle.getLatest(1000)
      });
    });
  }
}

module.exports = new ChronicleApi();
