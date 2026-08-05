import type { GmailProvider } from "../../providers/google/gmail/gmail.provider.js";
import type { SendEmailRequest } from "../../providers/google/gmail/send-email-request.js";
import type { SendEmailResult } from "../../providers/google/gmail/send-email-result.js";

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
}