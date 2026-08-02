import * as os from "node:os";

import { Logger } from "../logger/index.js";

export interface SystemInfo {
  platform: string;
  hostname: string;
  architecture: string;
  nodeVersion: string;
  uptime: number;
}

export class SystemInfoService {
  public static getSystemInfo(): SystemInfo {
    Logger.debug("SystemInfoService", "Collecting system information.");
    return {
      platform: process.platform,
      hostname: os.hostname(),
      architecture: process.arch,
      nodeVersion: process.version,
      uptime: process.uptime(),
    };
  }
}