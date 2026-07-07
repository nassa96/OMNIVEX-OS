/**
 * SAINT V74 — EXECUTION QUEUE
 * Async execution buffer (production safe)
 */

class ExecutionQueueV74 {

  constructor(worker) {
    this.queue = [];
    this.worker = worker;
    this.running = false;
  }

  enqueue(task) {
    this.queue.push(task);
  }

  async process() {

    if (this.running) return;
    this.running = true;

    while (this.queue.length > 0) {

      const task = this.queue.shift();

      try {
        await this.worker.execute(task);
      } catch (err) {
        console.log("[V74] retrying task");
        this.queue.push(task);
      }
    }

    this.running = false;
  }
}

module.exports = ExecutionQueueV74;
