import * as os from "node:os";

export interface SystemInfo {
  platform: string;
  hostname: string;
  architecture: string;
  nodeVersion: string;
  uptime: number;
}

export class SystemInfoService {
  public static getSystemInfo(): SystemInfo {
    return {
      platform: process.platform,
      hostname: os.hostname(),
      architecture: process.arch,
      nodeVersion: process.version,
      uptime: process.uptime(),
    };
  }
}