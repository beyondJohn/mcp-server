import express from "express";

export function createWebApp() {
  const app = express();

  app.use(express.json());

  app.get("/", (_req, res) => {
    res.send("MCP Server Running");
  });

  return app;
}