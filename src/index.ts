import "dotenv/config";

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { createServer } from "./mcp/server.js";

import { Logger } from "./logger/index.js";
import { startWebServer } from "./web/server.js";
import { config } from "./config/config.js";
Logger.info("Server", "Starting web server...");

startWebServer(config);
// import { GoogleProvider } from "./providers/google/google.provider.js";
// const googleProvider = new GoogleProvider(config, Logger);
// console.log(googleProvider.getAuthorizationUrl());
// process.exit(0);

Logger.info(
  "Server",
  "Starting MCP server..."
);

const server = createServer();

const transport = new StdioServerTransport();

await server.connect(transport);

Logger.info("Server", "MCP server started (stdio transport).");