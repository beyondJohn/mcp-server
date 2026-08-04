import type { Express } from "express";

export function registerRootRoutes(app: Express): void {
  app.get("/", (_req, res) => {
    res.send("MCP Server Running");
  });
}