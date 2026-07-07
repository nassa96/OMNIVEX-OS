/**
 * CHRONICLE LEARNING ENGINE
 * ---------------------------------
 * Converts historical execution + signals into:
 * - behavioral patterns
 * - performance attribution
 * - strategy bias detection
 * - SOPHIA feedback updates
 */

class LearningEngine {
  constructor(chronicle, eventBus) {
    this.chronicle = chronicle;
    this.eventBus = eventBus;
  }

  /**
   * MAIN LEARNING PIPELINE
   */
  runLearningCycle(limit = 500) {
    const events = this.chronicle.getHistory(limit);

    const dataset = this.buildDataset(events);
    const insights = this.extractInsights(dataset);

    this.applyToSophia(insights);

    this.eventBus.emit({
      type: "chronicle.learning.cycle",
      data: insights
    });

    return insights;
  }

  /**
   * STEP 1: STRUCTURE RAW EVENTS INTO ML-LIKE DATASET
   */
  buildDataset(events) {
    const dataset = [];

    let lastSignal = null;

    for (const e of events) {
      if (e.type === "sophia.signal") {
        lastSignal = e;
      }

      if (e.type === "saint.execution" && lastSignal) {
        dataset.push({
          signal: lastSignal,
          execution: e,
          success: this.assessOutcome(e)
        });
      }
    }

    return dataset;
  }

  /**
   * STEP 2: SIMPLE OUTCOME SCORING MODEL
   * (placeholder learning function — will evolve into real RL)
   */
  assessOutcome(execution) {
    const r = Math.random();

    if (execution.data?.action === "BUY") {
      return r > 0.5 ? 1 : -1;
    }

    if (execution.data?.action === "SELL") {
      return r > 0.5 ? 1 : -1;
    }

    return 0;
  }

  /**
   * STEP 3: EXTRACT SYSTEM INSIGHTS
   */
  extractInsights(dataset) {
    let wins = 0;
    let losses = 0;

    const signalBias = {
      BUY: 0,
      SELL: 0
    };

    for (const row of dataset) {
      if (row.success > 0) wins++;
      else losses++;

      const action = row.signal.data?.action;
      if (action) signalBias[action] += row.success;
    }

    const accuracy = wins / Math.max(wins + losses, 1);

    return {
      accuracy,
      wins,
      losses,
      signalBias,
      confidenceAdjustment:
        accuracy > 0.6 ? 1.05 : accuracy < 0.4 ? 0.9 : 1.0
    };
  }

  /**
   * STEP 4: FEED BACK INTO SOPHIA
   */
  applyToSophia(insights) {
    this.eventBus.emit({
      type: "sophia.learning.update",
      data: {
        accuracy: insights.accuracy,
        bias: insights.signalBias,
        confidenceAdjustment: insights.confidenceAdjustment
      }
    });
  }
}

module.exports = LearningEngine;
