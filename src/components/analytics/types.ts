export type GoogleConsentState = "denied" | "granted";

export interface GoogleConsentSettings {
  ad_personalization: GoogleConsentState;
  ad_storage: GoogleConsentState;
  ad_user_data: GoogleConsentState;
  analytics_storage: GoogleConsentState;
  wait_for_update?: number;
}

type GtagArguments =
  | [command: "config", targetId: string, params?: Record<string, unknown>]
  | [
      command: "consent",
      action: "default" | "update",
      settings: GoogleConsentSettings,
    ]
  | [command: "event", eventName: string, params?: Record<string, unknown>]
  | [command: "js", initializedAt: Date];

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: GtagArguments) => void;
  }
}
