export function initAurin(bus, agents) {

  const route = (event) => {
    if (!event || !event.type) return;

    switch (event.type) {

      case "market.tick":
        agents.sophia?.onEvent?.(event);
        agents.prometheus?.onEvent?.(event);
        break;

      case "signal.generated":
        agents.aegis?.onEvent?.(event);
        break;

      case "trade.request":
        agents.aegis?.onEvent?.(event);
        agents.saint?.onEvent?.(event);
        break;

      case "strategy.new":
        agents.hephaestus?.onEvent?.(event);
        break;

      case "stress.test":
        agents.tartarus?.onEvent?.(event);
        break;

      default:
        break;
    }
  };

  // Core routing bindings
  bus.on("market.tick", route);
  bus.on("signal.generated", route);
  bus.on("trade.request", route);
  bus.on("strategy.new", route);
  bus.on("stress.test", route);

  return { route };
}
