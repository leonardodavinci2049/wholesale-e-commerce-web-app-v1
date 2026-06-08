/**
 * Schemas de validação para o serviço Category
 */

import { z } from "zod";

/**
 * Schema para buscar menu hierárquico de taxonomias
 */
export const TaxonomyWebMenuSchema = z.object({
  pe_id_tipo: z
    .number()
    .int()
    .min(0, { message: "pe_id_tipo deve ser um número não-negativo" }),
  pe_parent_id: z
    .number()
    .int()
    .min(0, { message: "pe_parent_id deve ser um número não-negativo" })
    .optional(),
});

/**
 * Schema para buscar taxonomia por ID ou slug
 */
export const TaxonomyFindIdSchema = z
  .object({
    pe_taxonomy_id: z.number().int().positive().optional(),
    pe_id_taxonomy: z.number().int().positive().optional(),
  })
  .refine(
    (data) =>
      data.pe_taxonomy_id !== undefined || data.pe_id_taxonomy !== undefined,
    {
      message:
        "Informe pe_taxonomy_id ou pe_id_taxonomy para buscar a taxonomia",
      path: ["pe_taxonomy_id"],
    },
  );

export type TaxonomyWebMenuInput = z.infer<typeof TaxonomyWebMenuSchema>;
export type TaxonomyFindIdInput = z.infer<typeof TaxonomyFindIdSchema>;
