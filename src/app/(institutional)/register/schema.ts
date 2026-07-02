import { z } from "zod";
import { BRAZILIAN_STATES } from "@/core/constants/brazilian-states";

/**
 * IDs de tipo de pessoa no backend.
 * Padrão adotado: PJ = 1, PF = 2.
 * Centralizado aqui para facilitar ajuste caso a base utilize valores diferentes.
 */
export const PERSON_TYPE_ID = {
  PJ: 1,
  PF: 2,
} as const;

export const PERSON_TYPE_LABEL = {
  PJ: "Pessoa Jurídica",
  PF: "Pessoa Física",
} as const;

export type PersonTypeKey = keyof typeof PERSON_TYPE_ID;

export const personTypeEnum = z.enum(["PJ", "PF"]);

const UF_CODES = BRAZILIAN_STATES.map((state) => state.code) as [
  string,
  ...string[],
];

/**
 * Schema específico da landing page de pré-cadastro.
 * Regras mais fortes que o schema genérico do serviço (CustomerCreateSchema).
 * Os campos numéricos (cnpj, cpf, phone, whatsapp, zipCode) chegam aqui já
 * normalizados (somente dígitos) pela Server Action.
 */
export const registerLeadSchema = z
  .object({
    // Honeypot anti-bot — deve permanecer vazio.
    website: z.string().max(0).optional(),

    personType: personTypeEnum,

    name: z
      .string()
      .trim()
      .min(2, "Informe o nome do responsável")
      .max(255, "Nome muito longo"),

    email: z
      .string()
      .trim()
      .min(2, "Informe um e-mail comercial válido")
      .email("Informe um e-mail comercial válido")
      .max(255),

    cnpj: z.string().trim().optional(),
    companyName: z.string().trim().optional(),
    cpf: z.string().trim().optional(),

    phone: z
      .string()
      .trim()
      .max(15, "Telefone inválido")
      .optional()
      .or(z.literal("")),
    whatsapp: z
      .string()
      .trim()
      .min(10, "Informe um WhatsApp válido (com DDD)")
      .max(15, "WhatsApp inválido"),

    zipCode: z
      .string()
      .trim()
      .min(8, "Informe um CEP válido")
      .max(8, "CEP inválido"),
    address: z
      .string()
      .trim()
      .min(2, "Informe o endereço")
      .max(300, "Endereço muito longo"),
    addressNumber: z
      .string()
      .trim()
      .min(1, "Informe o número")
      .max(100, "Número inválido"),
    complement: z.string().trim().max(100).optional(),
    neighborhood: z
      .string()
      .trim()
      .min(2, "Informe o bairro")
      .max(300, "Bairro muito longo"),
    city: z
      .string()
      .trim()
      .min(2, "Informe a cidade")
      .max(300, "Cidade muito longa"),
    state: z.enum(UF_CODES, { message: "Selecione o estado" }),

    notes: z.string().trim().max(2000, "Texto muito longo").optional(),
  })
  .superRefine((data, ctx) => {
    if (data.personType === "PJ") {
      if (data.cnpj === undefined || data.cnpj.length !== 14) {
        ctx.addIssue({
          code: "custom",
          path: ["cnpj"],
          message: "Informe um CNPJ válido (14 dígitos)",
        });
      }
      if (!data.companyName || data.companyName.length < 2) {
        ctx.addIssue({
          code: "custom",
          path: ["companyName"],
          message: "Informe a razão social",
        });
      }
    } else {
      if (data.cpf === undefined || data.cpf.length !== 11) {
        ctx.addIssue({
          code: "custom",
          path: ["cpf"],
          message: "Informe um CPF válido (11 dígitos)",
        });
      }
    }
  });

export type RegisterLeadInput = z.infer<typeof registerLeadSchema>;
