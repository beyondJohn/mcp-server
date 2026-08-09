export interface CalendarUpdateEventRequest {
  calendarId: string;
  eventId: string;
  summary?: string;
  start?: string;
  end?: string;
  description?: string;
  location?: string;
}