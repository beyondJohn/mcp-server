import type { GmailProvider } from "../../providers/google/gmail/gmail.provider.js";

import type { SendEmailRequest } from "../../providers/google/gmail/send-email-request.js";
import type { SendEmailResult } from "../../providers/google/gmail/send-email-result.js";
import type { MessageSummary } from "../../providers/google/gmail/message-summary.js";
import type { Message } from "../../providers/google/gmail/message.js";

export class GmailService {
  constructor(
    private readonly gmailProvider: GmailProvider
  ) {}

  public async sendEmail(
    request: SendEmailRequest
  ): Promise<SendEmailResult> {
    return this.gmailProvider.sendEmail(request);
  }

  public async listLabels(): Promise<string[]> {
    return this.gmailProvider.listLabels();
  }

  public async listMessages(
    maxResults = 10
  ): Promise<MessageSummary[]> {
    return this.gmailProvider.listMessages(maxResults);
  }

  public async getMessage(
    id: string
  ): Promise<Message> {
    return this.gmailProvider.getMessage(id);
  }
}