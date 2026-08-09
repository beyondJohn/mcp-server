import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import type { CalendarService } from "../../../services/calendar/service.js";

export function registerCalendarGetEventTool(
    server: McpServer,
    calendarService: CalendarService
): void {
    server.registerTool(
        "google_calendar_get_event",
        {
            title: "Get Google Calendar Event",

            description:
                "Gets a specific Google Calendar event by calendar ID and event ID.",

            inputSchema: {
                calendarId: z
                    .string()
                    .default("primary"),

                eventId: z
                    .string()
                    .min(1),
            },
        },

        async ({
            calendarId,
            eventId,
        }) => {
            const event =
                await calendarService.getEvent(
                    calendarId,
                    eventId
                );

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(
                            event,
                            null,
                            2
                        ),
                    },
                ],
            };
        }
    );
}