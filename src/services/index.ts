import { TimeService } from "./time/time.service.js";
import { SystemInfoService } from "./system/system-info.service.js";
import { GmailService } from "./gmail/service.js";
import { SheetsService } from "./sheets/service.js";

import { GmailProvider } from "../providers/google/gmail/gmail.provider.js";
import { SheetsProvider } from "../providers/google/sheets/sheets.provider.js";

import type { IGoogleAuthProvider } from "../auth/google-auth.interface.js";
import { Logger } from "../logger/index.js";

import { PostgreSQLProvider } from "../providers/postgresql/postgresql.provider.js";
import { PostgreSQLService } from "./postgresql/service.js";
import type { PostgreSQLConfig } from "../providers/postgresql/postgresql-config.js";

export interface Services {
  timeService: TimeService;
  systemInfoService: SystemInfoService;
  gmailService: GmailService;
  sheetsService: SheetsService;
  postgresqlService: PostgreSQLService;
}

export function createServices(
  googleAuthProvider: IGoogleAuthProvider
): Services {
  const gmailProvider = new GmailProvider(
    googleAuthProvider,
    Logger
  );

  const sheetsProvider = new SheetsProvider(
    googleAuthProvider,
    Logger
  );

  const postgresqlConfig: PostgreSQLConfig = {
    host: "localhost",
    port: 5432,
    database: "mcp",
    user: "mcp",
    password: "mcp",
  };

  const postgresqlProvider =
    new PostgreSQLProvider(
      postgresqlConfig,
      Logger
    );

  void (async () => {
    try {
      await postgresqlProvider.connect();

      const rows =
        await postgresqlProvider.query(
          "SELECT version();"
        );

      Logger.info(
        "PostgreSQL",
        JSON.stringify(rows, null, 2)
      );

      await postgresqlProvider.disconnect();
    } catch (error) {
      Logger.error(
        "PostgreSQL",
        "Connection test failed.",
        error
      );
    }
  })();

  const postgresqlService =
    new PostgreSQLService(postgresqlProvider);

  return {
    timeService: new TimeService(),
    systemInfoService: new SystemInfoService(),
    gmailService: new GmailService(gmailProvider),
    sheetsService: new SheetsService(sheetsProvider),
    postgresqlService,
  };
}