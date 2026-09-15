import { z } from "zod";

const requestContextSchema = {
  pe_user_id: z.string().max(200).optional(),
  pe_user_name: z.string().max(200).optional(),
  pe_user_role: z.string().max(200).optional(),
  pe_person_id: z.number().optional(),
};

export const AppConfigFindAllSchema = z.object({
  ...requestContextSchema,
  pe_customer_id: z.number().int().positive(),
});

export const AppConfigFindByIdSchema = z.object({
  ...requestContextSchema,
  pe_config_id: z.number().int().positive(),
});

export const AppConfigFieldNameSchema = z.enum([
  "APP_NAME",
  "CLIENT_NAME",
  "SECTION_JSON",
  "BRAND_JSON",
  "COMPANY_JSON",
  "PAYMENT_METHOD_JSON",
  "HOME_CATEGORY_JSON",
  "HOME_MENU_JSON",
  "HOME_HERO",
]);

const appConfigFieldTypeSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
]);

export const AppConfigUpdateGeneralFieldSchema = z
  .object({
    ...requestContextSchema,
    pe_register_id: z.number().int().positive(),
    pe_field_type: appConfigFieldTypeSchema,
    pe_field: AppConfigFieldNameSchema,
    pe_value_str: z.string().nullable().optional(),
    pe_value_int: z.number().int().nullable().optional(),
    pe_value_numeric: z.number().nullable().optional(),
    pe_value_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .nullable()
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.pe_field_type === 1 && typeof data.pe_value_str !== "string") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["pe_value_str"],
        message: "pe_value_str é obrigatório quando pe_field_type = 1",
      });
    }

    if (data.pe_field_type === 2 && typeof data.pe_value_int !== "number") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["pe_value_int"],
        message: "pe_value_int é obrigatório quando pe_field_type = 2",
      });
    }

    if (data.pe_field_type === 3 && typeof data.pe_value_numeric !== "number") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["pe_value_numeric"],
        message: "pe_value_numeric é obrigatório quando pe_field_type = 3",
      });
    }

    if (data.pe_field_type === 4 && typeof data.pe_value_date !== "string") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["pe_value_date"],
        message: "pe_value_date é obrigatório quando pe_field_type = 4",
      });
    }
  });

export const AppMenuFindByTypeSchema = z.object({
  ...requestContextSchema,
  pe_customer_id: z.number().int().positive(),
  pe_type: z.string().min(1).max(100),
});

export type AppConfigFindAllInput = z.infer<typeof AppConfigFindAllSchema>;
export type AppConfigFindByIdInput = z.infer<typeof AppConfigFindByIdSchema>;
export type AppConfigUpdateGeneralFieldInput = z.infer<
  typeof AppConfigUpdateGeneralFieldSchema
>;
export type AppMenuFindByTypeInput = z.infer<typeof AppMenuFindByTypeSchema>;
