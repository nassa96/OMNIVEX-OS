export function aegis(signal, memory) {
  const volatility = Math.abs(memory.avg - memory.history.at(-1));

  let level = "LOW";
  if (volatility > 200) level = "HIGH";
  else if (volatility > 80) level = "MEDIUM";

  return { level };
}
