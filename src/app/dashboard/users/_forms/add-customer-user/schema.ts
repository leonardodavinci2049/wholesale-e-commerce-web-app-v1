import { z } from "zod";

export const addCustomerUserSchema = z.object({
  customerId: z.coerce.number().int().positive("ID de cliente inválido"),
});

export type AddCustomerUserInput = z.input<typeof addCustomerUserSchema>;
