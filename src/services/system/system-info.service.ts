import * as os from "node:os";

import { Logger } from "../../logger/index.js";
import type { ISystemInfoService, SystemInfo } from "./system-info.interface.js";

export class SystemInfoService implements ISystemInfoService {
  public getSystemInfo(): SystemInfo {
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