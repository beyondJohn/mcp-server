export const GoogleScopes = {
  PROFILE: [
    "openid",
    "email",
    "profile",
  ],

  GMAIL: [
    "https://www.googleapis.com/auth/gmail.modify",
  ],

  GMAIL_READONLY: [
    "https://www.googleapis.com/auth/gmail.readonly",
  ],

  GMAIL_SEND: [
    "https://www.googleapis.com/auth/gmail.send",
  ],

  SHEETS: [
    "https://www.googleapis.com/auth/spreadsheets",
  ],
  CALENDAR: [
    "https://www.googleapis.com/auth/calendar"
  ],
} as const;