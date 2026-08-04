import "dotenv/config";
import { GmailProvider } from "./providers/google/gmail/gmail.provider.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { config } from "./config/config.js";
import { Logger } from "./logger/index.js";

import { createServer } from "./mcp/server.js";
import { startWebServer } from "./web/server.js";

import { GoogleAuthProvider } from "./auth/google-auth.provider.js";
import { FileTokenStore } from "./auth/file-token-store.js";

Logger.info("Server", "Starting application...");

const tokenStore = new FileTokenStore();

const googleAuthProvider = new GoogleAuthProvider(
  config,
  tokenStore,
  Logger
);

await googleAuthProvider.initialize();

const gmailProvider = new GmailProvider(
  googleAuthProvider,
  Logger
);

const labels = await gmailProvider.listLabels();

Logger.info(
  "GmailProvider",
  `Found ${labels.length} labels.`
);

for (const label of labels) {
  Logger.info(
    "GmailProvider",
    label
  );
}

Logger.info("Server", "Starting web server...");
startWebServer(config, googleAuthProvider);

// const gmailProvider = new GmailProvider(
//   googleAuthProvider,
//   Logger
// );

Logger.info("Server", "Starting MCP server...");
const server = createServer();

const transport = new StdioServerTransport();

await server.connect(transport);

Logger.info("Server", "MCP server started.");