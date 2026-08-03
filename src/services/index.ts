import { TimeService } from "./time/time.service.js";
import { SystemInfoService } from "./system/system-info.service.js";

export interface Services {
  timeService: TimeService;
  systemInfoService: SystemInfoService;
}

export function createServices(): Services {
  return {
    timeService: new TimeService(),
    systemInfoService: new SystemInfoService(),
  };
}