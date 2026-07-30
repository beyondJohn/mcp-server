export interface TimeResult {
  iso: string;
  timezone: string;
  unix: number;
}

export class TimeService {
  /**
   * Returns the current date and time.
   *
   * @param timezone Optional IANA timezone (reserved for future use)
   */
  public static getCurrentTime(timezone?: string): TimeResult {
    const now = new Date();

    return {
      iso: now.toISOString(),
      timezone: timezone ?? "UTC",
      unix: now.getTime(),
    };
  }
}