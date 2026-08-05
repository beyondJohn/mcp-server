import type { SendEmailRequest } from "./send-email-request.js";

export function createMimeMessage(
  request: SendEmailRequest
): string {
  const message = [
    `To: ${request.to}`,
    `Subject: ${request.subject}`,
    "Content-Type: text/plain; charset=UTF-8",
    "MIME-Version: 1.0",
    "",
    request.body,
  ].join("\r\n");

  return Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}