import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import type { CalendarService } from "../../../services/calendar/service.js";

export function registerCalendarCreateEventTool(
  server: McpServer,
  calendarService: CalendarService
): void {
  server.registerTool(
    "google_calendar_create_event",
    {
      title: "Create Google Calendar Event",

      description:
        "Creates an event on a Google Calendar.",

      inputSchema: {
        calendarId: z
          .string()
          .default("primary")
          .describe(
            "Google Calendar ID. Defaults to the primary calendar."
          ),

        summary: z
          .string()
          .min(1)
          .describe(
            "Event title."
          ),

        start: z
          .string()
          .datetime()
          .describe(
            "Event start time in ISO 8601 format."
          ),

        end: z
          .string()
          .datetime()
          .describe(
            "Event end time in ISO 8601 format."
          ),

        description: z
          .string()
          .optional()
          .describe(
            "Optional event description."
          ),

        location: z
          .string()
          .optional()
          .describe(
            "Optional event location."
          ),
      },
    },

    async ({
      calendarId,
      summary,
      start,
      end,
      description,
      location,
    }) => {
      const event =
        await calendarService.createEvent({
          calendarId,
          summary,
          start,
          end,
          description,
          location,
        });

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