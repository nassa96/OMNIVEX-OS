export default function prometheus(bus) {
  bus.on("market.tick", (event) => {
    console.log("[PROMETHEUS EVENT]", event.type);

    const strength = Math.random();

    if (strength > 0.7) {
      bus.emit("signal", {
        strength,
        source: "PROMETHEUS",
        payload: event.payload
      });
    }
  });

  return {
    onEvent: () => {}
  };
}
