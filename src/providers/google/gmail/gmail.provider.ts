import { google, gmail_v1 } from "googleapis";

import type { IGoogleAuthProvider } from "../../../auth/google-auth.interface.js";
import { Logger } from "../../../logger/index.js";

export class GmailProvider {
  private readonly gmail: gmail_v1.Gmail;
  private get authClient() {
    return this.authProvider.getClient() as never;
  }

  constructor(
    private readonly authProvider: IGoogleAuthProvider,
    private readonly logger: typeof Logger
  ) {
    this.gmail = google.gmail({
      version: "v1",
      auth: this.authClient,
    });

    this.logger.info(
      "GmailProvider",
      "Gmail client initialized."
    );
  }

  public async listLabels(): Promise<string[]> {
    this.logger.debug(
      "GmailProvider",
      "Listing Gmail labels."
    );

    const response = await this.gmail.users.labels.list({
      userId: "me",
    });

    return (
      response.data.labels?.map(label => label.name ?? "") ?? []
    );
  }
}