export const GoogleScopes = {
  PROFILE: [
    "openid",
    "email",
    "profile",
  ],

  GMAIL_READONLY: [
    "https://www.googleapis.com/auth/gmail.readonly",
  ],

  GMAIL_SEND: [
    "https://www.googleapis.com/auth/gmail.send",
  ],
} as const;