import type { ICurrentTime, ITimeService } from "./time.interface.js";

export class TimeService implements ITimeService {
  public getCurrentTime(timezone?: string): ICurrentTime {
    const now = new Date();

    return {
      timezone: timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
      iso: now.toISOString(),
      local: now.toLocaleString("en-US", {
        timeZone: timezone,
      }),
    };
  }
}