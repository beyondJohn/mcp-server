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
});

export const env = envSchema.parse(process.env);