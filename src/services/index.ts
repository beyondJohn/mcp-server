import { TimeService } from "./time/time.service.js";
import { SystemInfoService } from "./system/system-info.service.js";
import { GmailService } from "./gmail/service.js";
import { SheetsService } from "./sheets/service.js";
import { CalendarService } from "./calendar/service.js";
import { GmailProvider } from "../providers/google/gmail/gmail.provider.js";
import { SheetsProvider } from "../providers/google/sheets/sheets.provider.js";

import type { IGoogleAuthProvider } from "../auth/google-auth.interface.js";
import { Logger } from "../logger/index.js";

import { PostgreSQLProvider } from "../providers/postgresql/postgresql.provider.js";
import { PostgreSQLService } from "./postgresql/service.js";
import { config } from "../config/config.js";
import { CalendarProvider } from "../providers/google/calendar/calendar.provider.js";

import { TavilyProvider } from "../providers/tavily/tavily.provider.js";
import { WebSearchService } from "./web-search/service.js";

export interface Services {
  timeService: TimeService;
  systemInfoService: SystemInfoService;
  gmailService: GmailService;
  sheetsService: SheetsService;
  postgresqlService: PostgreSQLService;
  calendarService: CalendarService;
  webSearchService: WebSearchService;
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


  const postgresqlProvider =
    new PostgreSQLProvider(
      config.postgresql,
      Logger
    );

  const postgresqlService =
    new PostgreSQLService(postgresqlProvider);

  const calendarProvider =
    new CalendarProvider(
      googleAuthProvider,
      Logger
    );

  const calendarService =
    new CalendarService(
      calendarProvider
    );

  const tavilyProvider =
    new TavilyProvider(
      config.tavily,
      Logger
    );

  const webSearchService =
    new WebSearchService(
      tavilyProvider
    );

  return {
    timeService: new TimeService(),
    systemInfoService: new SystemInfoService(),
    gmailService: new GmailService(gmailProvider),
    sheetsService: new SheetsService(sheetsProvider),
    postgresqlService,
    calendarService,
    webSearchService,
  };
}