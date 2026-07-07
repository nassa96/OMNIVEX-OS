/**
 * SAINT V81 — API GATEWAY
 */

class ApiGatewayV81 {

  constructor() {
    this.routes = {};
  }

  register(path, handler) {
    this.routes[path] = handler;
  }

  request(path, data) {

    if (!this.routes[path]) {
      return { error: "NOT_FOUND" };
    }

    return this.routes[path](data);
  }
}

module.exports = ApiGatewayV81;
