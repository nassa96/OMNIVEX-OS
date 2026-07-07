import fs from "fs";
import path from "path";

export function getEnv() {
  const envPath = path.resolve(".env");

  const raw = fs.existsSync(envPath)
    ? fs.readFileSync(envPath, "utf-8")
    : "";

  const env = Object.fromEntries(
    raw
      .split("\n")
      .filter(Boolean)
      .map(line => line.split("="))
      .filter(([k, v]) => k && v)
  );

  return {
    ...env,
    PORT: Number(env.PORT || 3000),
    WS_PORT: Number(env.WS_PORT || 8080)
  };
}
