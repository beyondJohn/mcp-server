import "dotenv/config";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { GoogleProvider } from "./providers/google/google.provider.js";
import { Logger } from "./logger/index.js";
import { config } from "./config/config.js";

import { startWebServer } from "./web/server.js";
import { createServer } from "./mcp/server.js";

Logger.info("Server", "Starting web server...");
const googleProvider = new GoogleProvider(config, Logger);
startWebServer(config, googleProvider);

Logger.info("Server","Starting MCP server...");
const server = createServer();
const transport = new StdioServerTransport();
await server.connect(transport);
Logger.info("Server", "MCP server started (stdio transport).");