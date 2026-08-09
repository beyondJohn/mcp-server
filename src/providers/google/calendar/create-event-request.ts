export interface CalendarCreateEventRequest {
  calendarId: string;
  summary: string;
  start: string;
  end: string;
  description?: string;
  location?: string;
}