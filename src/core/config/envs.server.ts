import "server-only";

import { z } from "zod";

import { parseEnv } from "@/core/config/env-validation";

const serverEnvsSchema = z.object({
  PORT: z.coerce.number().positive(),
  EXTERNAL_API_MAIN_URL: z.string().url(),
  EXTERNAL_API_ASSETS_URL: z.string().url(),
  APP_ID: z.coerce.number().positive(),
  STORE_ID: z.coerce.number().positive(),
  DATABASE_HOST: z.string().min(1),
  DATABASE_PORT: z.coerce.number().positive(),
  DATABASE_NAME: z.string().min(1),
  DATABASE_USER: z.string().min(1),
  DATABASE_PASSWORD: z.string().min(1),
  API_KEY: z.string().min(1),
  BETTER_AUTH_URL: z.string().url(),
  BETTER_AUTH_SECRET: z.string().min(1),
  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  EMAIL_SENDER_NAME: z.string().min(1),
  EMAIL_SENDER_ADDRESS: z.string().email(),
  REVALIDATE_SECRET: z.string().min(1),
  WEBHOOK_REVALIDATE_URL1: z.string().url().optional(),
  WEBHOOK_REVALIDATE_URL2: z.string().url().optional(),
});

export const serverEnvs = parseEnv(serverEnvsSchema, process.env, {
  scope: "server",
  sourceFiles: [".env.local"],
});

export type ServerEnvs = z.infer<typeof serverEnvsSchema>;
