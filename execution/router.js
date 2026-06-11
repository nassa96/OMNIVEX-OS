export async function routeOrder(order) {
  if (process.env.SYSTEM_MODE === "PAPER") {
    console.log("PAPER ORDER:", order);
    return { status: "paper", order };
  }

  return { status: "live-disabled", order };
}
