/**
 * SAINT V87 — API GATEWAY
 */

class ApiGatewayV87 {

  constructor() {
    this.routes = {};
  }

  register(route, handler) {
    this.routes[route] = handler;
  }

  request(route, payload) {

    const handler = this.routes[route];

    if (!handler) {
      return { error: "NOT_FOUND" };
    }

    return handler(payload);
  }
}

module.exports = ApiGatewayV87;
