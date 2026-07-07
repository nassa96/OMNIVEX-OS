/**
 * CHRONICLE APPEND GATEWAY
 * All events must pass through here
 */

export function createAppendLog(chronicle) {

  function append(event) {
    if (!event || !event.type) return null;

    return chronicle.append(event);
  }

  return {
    append
  };
}
