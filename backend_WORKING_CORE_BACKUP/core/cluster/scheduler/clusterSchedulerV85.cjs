/**
 * SAINT V85 — CLUSTER SCHEDULER
 */

class ClusterSchedulerV85 {

  constructor(nodeManager) {
    this.nodeManager = nodeManager;
  }

  schedule(task) {
    return this.nodeManager.assignTask(task);
  }
}

module.exports = ClusterSchedulerV85;
