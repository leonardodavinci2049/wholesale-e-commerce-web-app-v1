import { z } from "zod";

import { parseEnv } from "@/core/config/env-validation";

const publicEnvsSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_EXTERNAL_PATH_IMAGES_URL: z.string().url(),
  NEXT_PUBLIC_DEVELOPER_NAME: z.string().min(1),
  NEXT_PUBLIC_DEVELOPER_URL: z.string().url(),
  NEXT_PUBLIC_COMPANY_NAME: z.string().min(1),
  NEXT_PUBLIC_COMPANY_PHONE: z.string().min(10).max(20),
  NEXT_PUBLIC_COMPANY_EMAIL: z.string().email(),
  NEXT_PUBLIC_COMPANY_WHATSAPP: z.string().min(10).max(20),
  NEXT_PUBLIC_COMPANY_META_TITLE_MAIN: z
    .string()
    .min(1, "NEXT_PUBLIC_COMPANY_META_TITLE_MAIN is required"),
  NEXT_PUBLIC_COMPANY_META_TITLE_CAPTION: z
    .string()
    .min(1, "NEXT_PUBLIC_COMPANY_META_TITLE_CAPTION is required"),
  NEXT_PUBLIC_COMPANY_META_DESCRIPTION: z
    .string()
    .min(1, "NEXT_PUBLIC_COMPANY_META_DESCRIPTION is required"),
});

export const publicEnvs = parseEnv(
  publicEnvsSchema,
  {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_EXTERNAL_PATH_IMAGES_URL:
      process.env.NEXT_PUBLIC_EXTERNAL_PATH_IMAGES_URL,
    NEXT_PUBLIC_DEVELOPER_NAME: process.env.NEXT_PUBLIC_DEVELOPER_NAME,
    NEXT_PUBLIC_DEVELOPER_URL: process.env.NEXT_PUBLIC_DEVELOPER_URL,
    NEXT_PUBLIC_COMPANY_NAME: process.env.NEXT_PUBLIC_COMPANY_NAME,
    NEXT_PUBLIC_COMPANY_PHONE: process.env.NEXT_PUBLIC_COMPANY_PHONE,
    NEXT_PUBLIC_COMPANY_EMAIL: process.env.NEXT_PUBLIC_COMPANY_EMAIL,
    NEXT_PUBLIC_COMPANY_WHATSAPP: process.env.NEXT_PUBLIC_COMPANY_WHATSAPP,
    NEXT_PUBLIC_COMPANY_META_TITLE_MAIN:
      process.env.NEXT_PUBLIC_COMPANY_META_TITLE_MAIN,
    NEXT_PUBLIC_COMPANY_META_TITLE_CAPTION:
      process.env.NEXT_PUBLIC_COMPANY_META_TITLE_CAPTION,
    NEXT_PUBLIC_COMPANY_META_DESCRIPTION:
      process.env.NEXT_PUBLIC_COMPANY_META_DESCRIPTION,
  },
  {
    scope: "client",
    sourceFiles: [".env"],
  },
);

export type PublicEnvs = z.infer<typeof publicEnvsSchema>;
