import "dotenv/config";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { GoogleAuthProvider } from "./providers/google/google-auth.provider.js";
import { Logger } from "./logger/index.js";
import { config } from "./config/config.js";

import { startWebServer } from "./web/server.js";
import { createServer } from "./mcp/server.js";
import { FileTokenStore } from "./auth/file-token-store.js";

// const tokenStore = new FileTokenStore();

// await tokenStore.save({
//   access_token: "test",
// });

// const tokens = await tokenStore.load();

// Logger.info(
//   "TokenStore",
//   JSON.stringify(tokens, null, 2)
// );

// await tokenStore.clear();

Logger.info("Server", "Starting web server...");
const googleAuthProvider = new GoogleAuthProvider(config, Logger);
startWebServer(config, googleAuthProvider);

Logger.info("Server","Starting MCP server...");
const server = createServer();
const transport = new StdioServerTransport();
await server.connect(transport);
Logger.info("Server", "MCP server started (stdio transport).");