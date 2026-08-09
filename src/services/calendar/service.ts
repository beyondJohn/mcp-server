import type { CalendarProvider } from "../../providers/google/calendar/calendar.provider.js";
import type { calendar_v3 } from "googleapis";
import type { CalendarCreateEventRequest } from "../../providers/google/calendar/create-event-request.js";
import type { CalendarUpdateEventRequest } from "../../providers/google/calendar/update-event-request.js";

export class CalendarService {
    constructor(
        private readonly provider: CalendarProvider
    ) { }

    public async listCalendars(): Promise<
        calendar_v3.Schema$CalendarListEntry[]
    > {
        return this.provider.listCalendars();
    }

    public async listEvents(
        calendarId: string,
        timeMin?: string,
        timeMax?: string
    ): Promise<
        calendar_v3.Schema$Event[]
    > {
        return this.provider.listEvents(
            calendarId,
            timeMin,
            timeMax
        );
    }

    public async getEvent(
        calendarId: string,
        eventId: string
    ): Promise<
        calendar_v3.Schema$Event
    > {
        return this.provider.getEvent(
            calendarId,
            eventId
        );
    }

    public async createEvent(
        request: CalendarCreateEventRequest
    ): Promise<calendar_v3.Schema$Event> {
        return this.provider.createEvent(
            request
        );
    }

    public async updateEvent(
        request: CalendarUpdateEventRequest
    ): Promise<calendar_v3.Schema$Event> {
        return this.provider.updateEvent(
            request
        );
    }
    public async deleteEvent(
        calendarId: string,
        eventId: string
    ): Promise<void> {
        return this.provider.deleteEvent(
            calendarId,
            eventId
        );
    }

}