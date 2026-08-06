import { gmail_v1 } from "googleapis";

export function extractBody(
  part?: gmail_v1.Schema$MessagePart
): string {
  if (!part) {
    return "";
  }

  if (
    part.mimeType === "text/plain" &&
    part.body?.data
  ) {
    return decodeBase64Url(part.body.data);
  }

  for (const child of part.parts ?? []) {
    const body = extractBody(child);

    if (body) {
      return body;
    }
  }

  return "";
}

function decodeBase64Url(
  value: string
): string {
  const base64 = value
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  return Buffer
    .from(base64, "base64")
    .toString("utf8");
}