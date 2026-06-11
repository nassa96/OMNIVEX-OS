const { createLaunch, publishLaunch } = require("./dropspace");

async function publishSAINTCycle(apiKey, cycleData) {
  const launch = await createLaunch(apiKey, {
    title: `SAINT Cycle Update`,
    product_description: `
Capital: ${cycleData.capital}
P&L: ${cycleData.pnl}
Regime: ${cycleData.regime}
Win Rate: ${cycleData.winRate}
    `,
    platforms: ["twitter", "reddit"]
  });

  if (launch?.id) {
    await publishLaunch(apiKey, launch.id);
  }

  return launch;
}

module.exports = { publishSAINTCycle };
