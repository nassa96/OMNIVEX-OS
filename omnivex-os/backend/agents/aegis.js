export default function aegis(bus) {
  return {
    onEvent: (event) => {
      if (event?.type === "signal.generated") {
        const approved = Math.random() > 0.3;

        if (approved) {
          bus.emit("trade.request", {
            type: "trade.request",
            payload: event.payload
          });
        }
      }
    }
  };
}
