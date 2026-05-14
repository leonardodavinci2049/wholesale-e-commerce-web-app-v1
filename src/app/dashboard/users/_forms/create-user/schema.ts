import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string()
    .min(1, "O nome é obrigatório")
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres"),
  email: z.string().min(1, "O e-mail é obrigatório").email("E-mail inválido"),
  password: z
    .string()
    .min(1, "A senha é obrigatória")
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .max(100, "A senha deve ter no máximo 100 caracteres"),
  role: z.enum(["user", "admin"]).default("user"),
});

export type CreateUserInput = z.input<typeof createUserSchema>;
