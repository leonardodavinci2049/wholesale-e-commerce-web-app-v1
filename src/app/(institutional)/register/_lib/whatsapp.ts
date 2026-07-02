import { companyInfo } from "@/data/info-company";

/**
 * Mensagem padrão usada nos CTAs de WhatsApp da landing de pré-cadastro.
 */
export const WHATSAPP_PRECADASTRO_MESSAGE =
  "Olá! Tenho interesse no pré-cadastro para comprar no atacado com a MWS Distribuidora.";

/**
 * Monta uma URL de WhatsApp (wa.me) com mensagem pré-preenchida a partir do
 * número configurado em `companyInfo`.
 */
export function buildWhatsappUrl(message: string): string {
  const base = companyInfo.links.whatsappUrl;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_PRECADASTRO_URL = buildWhatsappUrl(
  WHATSAPP_PRECADASTRO_MESSAGE,
);
