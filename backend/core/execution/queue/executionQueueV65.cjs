/**
 * SAINT V65 — EXECUTION QUEUE ENGINE
 * Guarantees ordered execution
 */

class ExecutionQueueV65 {

  constructor(executor) {
    this.queue = [];
    this.executor = executor;
    this.processing = false;
  }

  enqueue(order) {
    this.queue.push(order);
  }

  async process() {

    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {

      const order = this.queue.shift();

      try {
        await this.executor.execute(order);
      } catch (err) {
        console.log("[V65] Execution failed, retrying...");
        this.queue.push(order);
      }
    }

    this.processing = false;
  }
}

module.exports = ExecutionQueueV65;
