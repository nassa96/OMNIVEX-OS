/**
 * OMNIVEX OS PRIME — CHRONICLE REPLAY ENGINE
 * Reconstruct system state from events
 */

export function createReplayEngine(chronicle, bus) {

  async function replay() {
    const events = chronicle.getAll();

    for (const event of events) {
      bus.emit(event.type, event);
    }

    return {
      replayed: events.length
    };
  }

  return {
    replay
  };
}
