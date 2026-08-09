import { google, calendar_v3 } from "googleapis";

import type { IGoogleAuthProvider } from "../../../auth/google-auth.interface.js";
import { Logger } from "../../../logger/index.js";

import type { CalendarCreateEventRequest } from "./create-event-request.js";
import type { CalendarUpdateEventRequest } from "./update-event-request.js";

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

    public async createEvent(
        request: CalendarCreateEventRequest
    ): Promise<calendar_v3.Schema$Event> {
        this.logger.debug(
            "CalendarProvider",
            `Creating event in calendar ${request.calendarId}.`
        );

        const response =
            await this.calendar.events.insert({
                calendarId: request.calendarId,
                requestBody: {
                    summary: request.summary,
                    description: request.description,
                    location: request.location,
                    start: {
                        dateTime: request.start,
                    },
                    end: {
                        dateTime: request.end,
                    },
                },
            });

        this.logger.info(
            "CalendarProvider",
            `Created calendar event ${response.data.id}.`
        );

        return response.data;
    }

    public async updateEvent(
        request: CalendarUpdateEventRequest
    ): Promise<calendar_v3.Schema$Event> {
        this.logger.debug(
            "CalendarProvider",
            `Updating event ${request.eventId}.`
        );

        const requestBody:
            calendar_v3.Schema$Event = {};

        if (request.summary !== undefined) {
            requestBody.summary =
                request.summary;
        }

        if (request.description !== undefined) {
            requestBody.description =
                request.description;
        }

        if (request.location !== undefined) {
            requestBody.location =
                request.location;
        }

        if (request.start !== undefined) {
            requestBody.start = {
                dateTime: request.start,
            };
        }

        if (request.end !== undefined) {
            requestBody.end = {
                dateTime: request.end,
            };
        }

        const response =
            await this.calendar.events.patch({
                calendarId: request.calendarId,
                eventId: request.eventId,
                requestBody,
            });

        this.logger.info(
            "CalendarProvider",
            `Updated calendar event ${request.eventId}.`
        );

        return response.data;
    }

    public async deleteEvent(
        calendarId: string,
        eventId: string
    ): Promise<void> {
        this.logger.debug(
            "CalendarProvider",
            `Deleting event ${eventId}.`
        );

        await this.calendar.events.delete({
            calendarId,
            eventId,
        });

        this.logger.info(
            "CalendarProvider",
            `Deleted calendar event ${eventId}.`
        );
    }
}