import express from "express";
import { createUnifiedGateway } from "./core/unifiedGateway.js";
import { registerRoutes } from "./http/routes.js";
import { createEventBus } from "../kernel/eventBus.js";

export function startGateway(config) {
  const app = express();
  app.use(express.json());

  const bus = createEventBus();

  const gateway = createUnifiedGateway({
    app,
    bus,
    config
  });

  registerRoutes(app, bus, gateway);

  return {
    app,
    bus,
    gateway
  };
}
