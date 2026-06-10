import { z } from "zod";

import { parseEnv } from "@/core/config/env-validation";

const homeCategoryIconSchema = z.enum([
  "BatteryCharging",
  "MonitorSmartphone",
  "Smartphone",
]);

const publicEnvsSchema = z.object({
  NEXT_PUBLIC_BASE_URL_APP: z.string().url(),
  NEXT_PUBLIC_APP_NAME: z.string().min(1),
  NEXT_PUBLIC_SIDEBAR_TITLE: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_DEVELOPER_NAME: z.string().min(1),
  NEXT_PUBLIC_DEVELOPER_URL: z.string().min(1),

  NEXT_PUBLIC_HOME_CATEGORY_TITLE1: z.string().min(1),
  NEXT_PUBLIC_HOME_CATEGORY_TITLE2: z.string().min(1),
  NEXT_PUBLIC_HOME_CATEGORY_TITLE3: z.string().min(1),

  NEXT_PUBLIC_HOME_CATEGORY_ICON1: homeCategoryIconSchema,
  NEXT_PUBLIC_HOME_CATEGORY_ICON2: homeCategoryIconSchema,
  NEXT_PUBLIC_HOME_CATEGORY_ICON3: homeCategoryIconSchema,

  NEXT_PUBLIC_HOME_CATEGORY_DESCRIPTION1: z.string().min(1),
  NEXT_PUBLIC_HOME_CATEGORY_DESCRIPTION2: z.string().min(1),
  NEXT_PUBLIC_HOME_CATEGORY_DESCRIPTION3: z.string().min(1),

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

    NEXT_PUBLIC_HOME_CATEGORY_TITLE1:
      process.env.NEXT_PUBLIC_HOME_CATEGORY_TITLE1,
    NEXT_PUBLIC_HOME_CATEGORY_TITLE2:
      process.env.NEXT_PUBLIC_HOME_CATEGORY_TITLE2,
    NEXT_PUBLIC_HOME_CATEGORY_TITLE3:
      process.env.NEXT_PUBLIC_HOME_CATEGORY_TITLE3,

    NEXT_PUBLIC_HOME_CATEGORY_ICON1:
      process.env.NEXT_PUBLIC_HOME_CATEGORY_ICON1,
    NEXT_PUBLIC_HOME_CATEGORY_ICON2:
      process.env.NEXT_PUBLIC_HOME_CATEGORY_ICON2,
    NEXT_PUBLIC_HOME_CATEGORY_ICON3:
      process.env.NEXT_PUBLIC_HOME_CATEGORY_ICON3,

    NEXT_PUBLIC_HOME_CATEGORY_DESCRIPTION1:
      process.env.NEXT_PUBLIC_HOME_CATEGORY_DESCRIPTION1,
    NEXT_PUBLIC_HOME_CATEGORY_DESCRIPTION2:
      process.env.NEXT_PUBLIC_HOME_CATEGORY_DESCRIPTION2,
    NEXT_PUBLIC_HOME_CATEGORY_DESCRIPTION3:
      process.env.NEXT_PUBLIC_HOME_CATEGORY_DESCRIPTION3,

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
