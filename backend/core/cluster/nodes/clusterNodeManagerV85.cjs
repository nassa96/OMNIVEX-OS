/**
 * SAINT V85 — CLUSTER NODE MANAGER
 * Distributed execution nodes
 */

class ClusterNodeManagerV85 {

  constructor() {
    this.nodes = new Map();
  }

  registerNode(id, meta) {
    this.nodes.set(id, {
      ...meta,
      status: "ACTIVE",
      load: 0
    });
  }

  getHealthyNodes() {
    return Array.from(this.nodes.values())
      .filter(n => n.status === "ACTIVE");
  }

  assignTask(task) {

    const nodes = this.getHealthyNodes();

    if (nodes.length === 0) return null;

    const selected = nodes.sort((a, b) => a.load - b.load)[0];

    selected.load += 1;

    return {
      node: selected,
      task
    };
  }
}

module.exports = ClusterNodeManagerV85;
