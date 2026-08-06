import { TimeService } from "./time/time.service.js";
import { SystemInfoService } from "./system/system-info.service.js";
import { GmailService } from "./gmail/service.js";
import { SheetsService } from "./sheets/service.js";

import { GmailProvider } from "../providers/google/gmail/gmail.provider.js";
import { SheetsProvider } from "../providers/google/sheets/sheets.provider.js";

import type { IGoogleAuthProvider } from "../auth/google-auth.interface.js";
import { Logger } from "../logger/index.js";

export interface Services {
  timeService: TimeService;
  systemInfoService: SystemInfoService;
  gmailService: GmailService;
  sheetsService: SheetsService;
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

  return {
    timeService: new TimeService(),
    systemInfoService: new SystemInfoService(),
    gmailService: new GmailService(gmailProvider),
    sheetsService: new SheetsService(sheetsProvider),
  };
}