import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import type { CalendarService } from "../../../services/calendar/service.js";

export function registerCalendarListEventsTool(
    server: McpServer,
    calendarService: CalendarService
): void {
    server.registerTool(
        "google_calendar_list_events",
        {
            title: "List Google Calendar Events",

            description:
                "Lists events from a Google Calendar. Optional ISO 8601 timeMin and timeMax values can restrict the date range.",

            inputSchema: {
                calendarId: z
                    .string()
                    .default("primary")
                    .describe(
                        "Google Calendar ID. Defaults to the user's primary calendar."
                    ),

                timeMin: z
                    .string()
                    .datetime()
                    .optional()
                    .describe(
                        "Optional inclusive start time in ISO 8601 format."
                    ),

                timeMax: z
                    .string()
                    .datetime()
                    .optional()
                    .describe(
                        "Optional exclusive end time in ISO 8601 format."
                    ),
            },
        },

        async ({
            calendarId,
            timeMin,
            timeMax,
        }) => {
            const events =
                await calendarService.listEvents(
                    calendarId,
                    timeMin,
                    timeMax
                );

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(
                            events,
                            null,
                            2
                        ),
                    },
                ],
            };
        }
    );
}