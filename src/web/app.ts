import express, { type Express } from "express";

export function createWebApp(): Express {
  const app = express();

  app.use(express.json());

  app.get("/", (_req, res) => {
    res.send("MCP Server Running");
  });

  app.get("/health", (_req, res) => {
    res.json({
      status: "ok",
    });
  });

  return app;
}