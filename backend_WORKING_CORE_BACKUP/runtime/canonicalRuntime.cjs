(async () => {
  // Dynamic ESM bridge loader
  const { pathToFileURL } = require("url");

  const corePath = pathToFileURL(
    require("path").resolve(__dirname, "../core/kernel/runtimeKernel.js")
  ).href;

  const kernel = await import(corePath);

  const { bootSystem, runtimeTick } = kernel;

  console.log("[OMNIVEX] Kernel booting...");

  const registry = {};

  await bootSystem(registry);

  setInterval(async () => {
    const market = {
      symbol: "BTC",
      price: 50000 + Math.random() * 1000
    };

    await runtimeTick(market);
  }, 2000);
})();
