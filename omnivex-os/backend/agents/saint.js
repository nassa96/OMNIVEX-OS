export default function saint(bus) {
  return {
    onEvent: (event) => {
      if (event?.type === "trade.request") {
        console.log("EXECUTING TRADE:", event.payload);

        bus.emit("trade.executed", {
          type: "trade.executed",
          payload: event.payload
        });
      }
    }
  };
}
