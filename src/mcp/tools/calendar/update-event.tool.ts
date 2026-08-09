import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import type { CalendarService } from "../../../services/calendar/service.js";

export function registerCalendarUpdateEventTool(
  server: McpServer,
  calendarService: CalendarService
): void {
  server.registerTool(
    "google_calendar_update_event",
    {
      title: "Update Google Calendar Event",

      description:
        "Updates one or more fields of an existing Google Calendar event.",

      inputSchema: {
        calendarId: z
          .string()
          .default("primary"),

        eventId: z
          .string()
          .min(1),

        summary: z
          .string()
          .min(1)
          .optional(),

        start: z
          .string()
          .datetime()
          .optional(),

        end: z
          .string()
          .datetime()
          .optional(),

        description: z
          .string()
          .optional(),

        location: z
          .string()
          .optional(),
      },
    },

    async ({
      calendarId,
      eventId,
      summary,
      start,
      end,
      description,
      location,
    }) => {
      if (
        summary === undefined &&
        start === undefined &&
        end === undefined &&
        description === undefined &&
        location === undefined
      ) {
        throw new Error(
          "At least one event field must be provided for update."
        );
      }

      const event =
        await calendarService.updateEvent({
          calendarId,
          eventId,
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