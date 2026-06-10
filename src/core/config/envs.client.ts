import { z } from "zod";

import { parseEnv } from "@/core/config/env-validation";

const publicEnvsSchema = z.object({
  NEXT_PUBLIC_BASE_URL_APP: z.string().url(),
  NEXT_PUBLIC_APP_NAME: z.string().min(1),
  NEXT_PUBLIC_SIDEBAR_TITLE: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_DEVELOPER_NAME: z.string().min(1),
  NEXT_PUBLIC_DEVELOPER_URL: z.string().min(1),

  NEXT_PUBLIC_DISCOUNT_CASH_PAYMENT: z.coerce.number().nonnegative(),
  NEXT_PUBLIC_PAY_IN_UP_TO: z.coerce.number().int().positive(),
  NEXT_PUBLIC_FREE_SHIPPING_OVER: z.coerce.number().nonnegative(),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().min(1),
});

export const publicEnvs = parseEnv(
  publicEnvsSchema,
  {
    NEXT_PUBLIC_BASE_URL_APP: process.env.NEXT_PUBLIC_BASE_URL_APP,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_SIDEBAR_TITLE: process.env.NEXT_PUBLIC_SIDEBAR_TITLE,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_DEVELOPER_NAME: process.env.NEXT_PUBLIC_DEVELOPER_NAME,
    NEXT_PUBLIC_DEVELOPER_URL: process.env.NEXT_PUBLIC_DEVELOPER_URL,
    NEXT_PUBLIC_DISCOUNT_CASH_PAYMENT:
      process.env.NEXT_PUBLIC_DISCOUNT_CASH_PAYMENT,
    NEXT_PUBLIC_PAY_IN_UP_TO: process.env.NEXT_PUBLIC_PAY_IN_UP_TO,
    NEXT_PUBLIC_FREE_SHIPPING_OVER: process.env.NEXT_PUBLIC_FREE_SHIPPING_OVER,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  },
  {
    scope: "client",
    sourceFiles: [".env", ".env.local"],
  },
);

export type PublicEnvs = z.infer<typeof publicEnvsSchema>;
