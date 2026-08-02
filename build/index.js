import "dotenv/config";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./server.js";
import { Logger } from "./logger/index.js";
Logger.info("Server", "Starting MCP server...");
const server = createServer();
const transport = new StdioServerTransport();
await server.connect(transport);
Logger.info("Server", "MCP server started (stdio transport).");
//# sourceMappingURL=index.js.map