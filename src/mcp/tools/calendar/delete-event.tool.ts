import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import type { CalendarService } from "../../../services/calendar/service.js";

export function registerCalendarDeleteEventTool(
  server: McpServer,
  calendarService: CalendarService
): void {
  server.registerTool(
    "google_calendar_delete_event",
    {
      title: "Delete Google Calendar Event",

      description:
        "Permanently deletes an event from a Google Calendar.",

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
      await calendarService.deleteEvent(
        calendarId,
        eventId
      );

      return {
        content: [
          {
            type: "text",
            text:
              `Deleted Google Calendar event ${eventId}.`,
          },
        ],
      };
    }
  );
}