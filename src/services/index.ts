import { TimeService } from "./time/time.service.js";
import { SystemInfoService } from "./system/system-info.service.js";
import { GmailService } from "./gmail/gmail.service.js";
import { GmailProvider } from "../providers/google/gmail/gmail.provider.js";
import type { IGoogleAuthProvider } from "../auth/google-auth.interface.js";
import { Logger } from "../logger/index.js";

export interface Services {
  timeService: TimeService;
  systemInfoService: SystemInfoService;
  gmailService: GmailService;
}

export function createServices(
  googleAuthProvider: IGoogleAuthProvider
): Services {
  const gmailProvider = new GmailProvider(
    googleAuthProvider,
    Logger
  );

  return {
    timeService: new TimeService(),
    systemInfoService: new SystemInfoService(),
    gmailService: new GmailService(gmailProvider),
  };
}