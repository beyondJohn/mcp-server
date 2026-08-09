import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import type { CalendarService } from "../../../services/calendar/service.js";

export function registerCalendarListCalendarsTool(
    server: McpServer,
    calendarService: CalendarService
): void {
    server.registerTool(
        "google_calendar_list_calendars",
        {
            title: "List Google Calendars",

            description:
                "Lists the Google Calendars available to the authenticated user.",

            inputSchema: {},
        },

        async () => {
            const calendars =
                await calendarService.listCalendars();

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(
                            calendars,
                            null,
                            2
                        ),
                    },
                ],
            };
        }
    );
}