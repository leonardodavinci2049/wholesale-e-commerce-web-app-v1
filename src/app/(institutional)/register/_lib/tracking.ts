/**
 * Interface isolada de tracking para a landing page de pré-cadastro.
 *
 * Usa a camada dataLayer (padrão GTM) quando disponível e faz no-op caso
 * contrário, para que o tracking nunca quebre a UI nem acople a regra de
 * negócio a uma ferramenta específica de analytics/ads.
 */

export type TrackingEvent =
  | "register_landing_view"
  | "register_primary_cta_click"
  | "register_form_start"
  | "register_submit_success"
  | "register_submit_error"
  | "register_whatsapp_click";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function trackEvent(
  event: TrackingEvent,
  payload: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined") return;

  try {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({ event, ...payload });
  } catch {
    // best-effort: falhas de tracking não devem impactar o usuário
  }
}
