import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  GOOGLE_CLIENT_ID: z.string().default(""),

  GOOGLE_CLIENT_SECRET: z.string().default(""),

  GOOGLE_REDIRECT_URI: z
    .string()
    .url()
    .default("http://localhost:3000/oauth/callback"),

  POSTGRESQL_HOST: z
    .string()
    .default("localhost"),

  POSTGRESQL_PORT: z.coerce
    .number()
    .int()
    .positive()
    .default(5432),

  POSTGRESQL_DATABASE: z
    .string()
    .default("mcp"),

  POSTGRESQL_USER: z
    .string()
    .default("mcp"),

  POSTGRESQL_PASSWORD: z
    .string()
    .default("mcp"),
});

export const env = envSchema.parse(process.env);