const fs = require("fs");
const path = require("path");

class ChronicleMemory {
  constructor() {
    this.buffer = [];
    this.maxBuffer = 200;

    this.filePath = path.join(
      process.cwd(),
      "state",
      "chronicle.log.jsonl"
    );

    if (!fs.existsSync(path.dirname(this.filePath))) {
      fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    }
  }

  /**
   * ---------------------------
   * WRITE EVENT (APPEND ONLY)
   * ---------------------------
   */
  write(event) {
    const record = {
      ...event,
      ts: Date.now()
    };

    this.buffer.push(record);

    fs.appendFileSync(
      this.filePath,
      JSON.stringify(record) + "\n"
    );

    if (this.buffer.length > this.maxBuffer) {
      this.buffer.shift();
    }
  }

  /**
   * ---------------------------
   * READ RECENT HISTORY
   * ---------------------------
   */
  read(limit = 50) {
    if (!fs.existsSync(this.filePath)) return [];

    const data = fs
      .readFileSync(this.filePath, "utf-8")
      .trim()
      .split("\n")
      .filter(Boolean)
      .map(JSON.parse);

    return data.slice(-limit);
  }

  /**
   * ---------------------------
   * LEARNING SIGNAL GENERATION
   * ---------------------------
   */
  generateLearningSignal() {
    const history = this.read(100);

    let wins = 0;
    let losses = 0;
    let slippageSum = 0;

    for (const h of history) {
      if (h.type === "execution") {
        if (h.pnl > 0) wins++;
        else losses++;

        slippageSum += h.slippage || 0;
      }
    }

    const total = wins + losses || 1;

    return {
      winRate: wins / total,
      avgSlippage: slippageSum / total,
      sampleSize: total
    };
  }
}

module.exports = ChronicleMemory;
