export function startChronicle(bus) {
  let log = [];

  bus.onAny?.((event) => {
    log.push(event);
  });

  bus.on("*", (event) => {
    log.push(event);
  });

  console.log("[CHRONICLE] MEMORY ACTIVE");

  return {
    size: () => log.length,
    dump: () => log
  };
}
