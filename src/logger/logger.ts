export class Logger {
  private static timestamp(): string {
    return new Date().toISOString();
  }

  private static format(
    level: string,
    context: string,
    message: string
  ): string {
    return `[${Logger.timestamp()}] ${level.padEnd(5)} [${context}] ${message}`;
  }

  public static info(context: string, message: string): void {
    console.error(Logger.format("INFO", context, message));
  }

  public static warn(context: string, message: string): void {
    console.error(Logger.format("WARN", context, message));
  }

  public static error(
    context: string,
    message: string,
    error?: unknown
  ): void {
    console.error(Logger.format("ERROR", context, message));

    if (error) {
      console.error(error);
    }
  }

  public static debug(context: string, message: string): void {
    if (process.env.NODE_ENV === "development") {
      console.error(Logger.format("DEBUG", context, message));
    }
  }
}