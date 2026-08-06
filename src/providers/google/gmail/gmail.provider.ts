import { google, gmail_v1 } from "googleapis";

import type { IGoogleAuthProvider } from "../../../auth/google-auth.interface.js";
import { Logger } from "../../../logger/index.js";

import type { SendEmailRequest } from "./send-email-request.js";
import type { SendEmailResult } from "./send-email-result.js";
import type { MessageSummary } from "./message-summary.js";

import { createMimeMessage } from "./mime-message.js";
import type { Message } from "./message.js";

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

  public async listMessages(
    maxResults = 10
  ): Promise<MessageSummary[]> {
    this.logger.debug(
      "GmailProvider",
      `Listing ${maxResults} inbox messages.`
    );

    const response =
      await this.gmail.users.messages.list({
        userId: "me",
        labelIds: ["INBOX"],
        maxResults,
      });

    const messages = response.data.messages ?? [];

    const summaries: MessageSummary[] = [];

    for (const message of messages) {
      if (!message.id) {
        continue;
      }

      const details =
        await this.gmail.users.messages.get({
          userId: "me",
          id: message.id,
          format: "metadata",
          metadataHeaders: [
            "Subject",
            "From",
            "Date",
          ],
        });

      const headers =
        details.data.payload?.headers ?? [];

      const getHeader = (name: string): string =>
        headers.find(
          header => header.name === name
        )?.value ?? "";

      summaries.push({
        id: details.data.id ?? "",
        threadId: details.data.threadId ?? "",
        subject: getHeader("Subject"),
        from: getHeader("From"),
        date: getHeader("Date"),
      });
    }

    this.logger.info(
      "GmailProvider",
      `Found ${summaries.length} messages.`
    );

    return summaries;
  }

  private extractBody(
    part?: gmail_v1.Schema$MessagePart
  ): string {
    if (!part) {
      return "";
    }

    if (
      part.mimeType === "text/plain" &&
      part.body?.data
    ) {
      return this.decodeBase64Url(
        part.body.data
      );
    }

    for (const child of part.parts ?? []) {
      const body =
        this.extractBody(child);

      if (body) {
        return body;
      }
    }

    return "";
  }

  private decodeBase64Url(
    value: string
  ): string {
    const base64 = value
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    return Buffer
      .from(base64, "base64")
      .toString("utf8");
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

  public async getMessage(
    id: string
  ): Promise<Message> {
    this.logger.debug(
      "GmailProvider",
      `Reading message ${id}.`
    );

    const response =
      await this.gmail.users.messages.get({
        userId: "me",
        id,
        format: "full",
      });

    const payload = response.data.payload;

    const headers = payload?.headers ?? [];

    const getHeader = (name: string): string =>
      headers.find(
        header => header.name === name
      )?.value ?? "";

    const body =
      this.extractBody(payload);

    this.logger.info(
      "GmailProvider",
      `Read message ${id}.`
    );

    return {
      id: response.data.id ?? "",
      threadId: response.data.threadId ?? "",
      subject: getHeader("Subject"),
      from: getHeader("From"),
      to: getHeader("To"),
      date: getHeader("Date"),
      body,
    };
  }
}