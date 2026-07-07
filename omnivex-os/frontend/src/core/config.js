const isProd = window.location.hostname !== "localhost";

export const CONFIG = {
  WS_URL: isProd
    ? "wss://YOUR-RAILWAY-URL/ws"
    : "ws://localhost:3000",

  API_URL: isProd
    ? "https://YOUR-RAILWAY-URL"
    : "http://localhost:3000"
};
