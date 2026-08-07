import { env } from "./env.js";
import type { PostgreSQLConfig } from "../providers/postgresql/postgresql-config.js";

export interface AppConfig {
  app: {
    name: string;
    version: string;
    environment: "development" | "test" | "production";
  };

  google: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
  };

  server: {
    transport: "stdio" | "http";
    port: number;
  };

  postgresql: PostgreSQLConfig;
}

export const config: AppConfig = {
  app: {
    name: "mcp-server",
    version: "1.0.0",
    environment: env.NODE_ENV,
  },

  google: {
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    redirectUri: env.GOOGLE_REDIRECT_URI,
  },

  server: {
    transport: "stdio",
    port: 8787,
  },

  postgresql: {
    host: env.POSTGRESQL_HOST,
    port: env.POSTGRESQL_PORT,
    database: env.POSTGRESQL_DATABASE,
    user: env.POSTGRESQL_USER,
    password: env.POSTGRESQL_PASSWORD,
  },

};