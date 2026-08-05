/**
 * Interface isolada de tracking para a landing page de pré-cadastro.
 *
 * Mantém os nomes de evento da landing tipados e delega o envio ao módulo
 * central do Google Analytics.
 */

import { trackEvent as trackGoogleAnalyticsEvent } from "@/components/analytics";

export type TrackingEvent =
  | "register_landing_view"
  | "register_primary_cta_click"
  | "register_form_start"
  | "register_submit_success"
  | "register_submit_error"
  | "register_whatsapp_click";

export function trackEvent(
  event: TrackingEvent,
  payload: Record<string, unknown> = {},
): void {
  trackGoogleAnalyticsEvent(event, payload);
}
