import { google, calendar_v3 } from "googleapis";

import type { IGoogleAuthProvider } from "../../auth/google-auth.interface.js";
import { Logger } from "../../logger/index.js";

export class CalendarProvider {
    private readonly calendar:
        calendar_v3.Calendar;

    private get authClient() {
        return this.authProvider.getClient() as never;
    }

    constructor(
        private readonly authProvider: IGoogleAuthProvider,
        private readonly logger: typeof Logger
    ) {
        this.calendar = google.calendar({
            version: "v3",
            auth: this.authClient,
        });

        this.logger.info(
            "CalendarProvider",
            "Google Calendar client initialized."
        );
    }

    public async listCalendars(): Promise<
        calendar_v3.Schema$CalendarListEntry[]
    > {
        this.logger.debug(
            "CalendarProvider",
            "Listing calendars."
        );

        const response =
            await this.calendar.calendarList.list();

        const calendars =
            response.data.items ?? [];

        this.logger.info(
            "CalendarProvider",
            `Found ${calendars.length} calendar(s).`
        );

        return calendars;
    }

    public async listEvents(
        calendarId: string,
        timeMin?: string,
        timeMax?: string
    ): Promise<
        calendar_v3.Schema$Event[]
    > {
        this.logger.debug(
            "CalendarProvider",
            `Listing events for calendar ${calendarId}.`
        );

        const response =
            await this.calendar.events.list({
                calendarId,
                timeMin,
                timeMax,
                singleEvents: true,
                orderBy: "startTime",
            });

        const events =
            response.data.items ?? [];

        this.logger.info(
            "CalendarProvider",
            `Found ${events.length} event(s).`
        );

        return events;
    }

    public async getEvent(
        calendarId: string,
        eventId: string
    ): Promise<
        calendar_v3.Schema$Event
    > {
        this.logger.debug(
            "CalendarProvider",
            `Getting event ${eventId}.`
        );

        const response =
            await this.calendar.events.get({
                calendarId,
                eventId,
            });

        return response.data;
    }
}