import { google, gmail_v1 } from "googleapis";

import type { IGoogleAuthProvider } from "../../../auth/google-auth.interface.js";
import { Logger } from "../../../logger/index.js";

import type { SendEmailRequest } from "./send-email-request.js";
import type { SendEmailResult } from "./send-email-result.js";
import { createMimeMessage } from "./mime-message.js";

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

  public async sendEmail(
    request: SendEmailRequest
  ): Promise<SendEmailResult> {
    this.logger.debug(
      "GmailProvider",
      `Sending email to ${request.to}.`
    );

    const raw = createMimeMessage(request);

    const response =
      await this.gmail.users.messages.send({
        userId: "me",
        requestBody: {
          raw,
        },
      });

    this.logger.info(
      "GmailProvider",
      `Email sent to ${request.to}.`
    );

    return {
      messageId: response.data.id ?? "",
    };
  }
}