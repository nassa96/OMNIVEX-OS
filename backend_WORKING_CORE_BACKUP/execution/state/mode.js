export const MODE = process.env.MODE || "PAPER";

export function isLiveMode() {
  return MODE === "LIVE";
}

export function isPaperMode() {
  return MODE === "PAPER";
}
