export default function sophia(bus) {
  return {
    onEvent: (event) => {
      if (event?.type === "market.tick") {
        bus.emit("signal.generated", {
          type: "signal.generated",
          payload: {
            strength: Math.random(),
            source: "SOPHIA"
          }
        });
      }
    }
  };
}
