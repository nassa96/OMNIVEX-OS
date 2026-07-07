import net from "net";

const BASE_PORT = 3000;
const MAX_PORT = 3010;

export async function getFreePort() {
  for (let port = BASE_PORT; port <= MAX_PORT; port++) {
    const available = await checkPort(port);
    if (available) return port;
  }

  throw new Error("No free ports available (3000-3010)");
}

function checkPort(port) {
  return new Promise((resolve) => {
    const tester = net.createServer();

    tester.once("error", () => resolve(false));

    tester.once("listening", () => {
      tester.close();
      resolve(true);
    });

    tester.listen(port);
  });
}
