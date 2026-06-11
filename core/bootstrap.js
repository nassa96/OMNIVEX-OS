import http from "http";
import { loadEnv } from "../utils/env.js";
import { startWS } from "../ws/ws.js";

export function bootstrap(app) {
  loadEnv();

  const server = http.createServer(app);

  startWS(server);

  return server;
}
