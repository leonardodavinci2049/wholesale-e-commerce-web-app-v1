"use client";

import { Cookie } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { GoogleConsentSettings, GoogleConsentState } from "./types";

const CONSENT_STORAGE_KEY = "analytics_consent";

function readConsent(): GoogleConsentState | null {
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);

    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

function persistConsent(consent: GoogleConsentState): void {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, consent);
  } catch {
    // Consent still applies to the current page if storage is unavailable.
  }
}

function updateGoogleConsent(analyticsStorage: GoogleConsentState): void {
  const settings: GoogleConsentSettings = {
    analytics_storage: analyticsStorage,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  };

  window.gtag?.("consent", "update", settings);
}

export function CookieConsent() {
  const [consent, setConsent] = useState<GoogleConsentState | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const storedConsent = readConsent();
    setConsent(storedConsent);
    setIsOpen(storedConsent === null);
  }, []);

  const handleConsent = (value: GoogleConsentState): void => {
    persistConsent(value);
    updateGoogleConsent(value);
    setConsent(value);
    setIsOpen(false);
  };

  if (isOpen) {
    return (
      <section
        aria-label="Preferências de cookies"
        aria-live="polite"
        className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-2xl border bg-background p-4 text-foreground shadow-2xl sm:inset-x-6 sm:p-5"
      >
        <div className="flex items-start gap-3">
          <Cookie className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
          <div className="space-y-3">
            <div className="space-y-1">
              <h2 className="font-semibold">Cookies analíticos</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Usamos cookies opcionais do Google Analytics para entender a
                navegação e melhorar nossos serviços. Consulte nossa{" "}
                <Link
                  href="/privacy"
                  className="font-medium text-foreground underline underline-offset-4"
                >
                  Política de Privacidade
                </Link>
                .
              </p>
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleConsent("denied")}
              >
                Recusar opcionais
              </Button>
              <Button type="button" onClick={() => handleConsent("granted")}>
                Aceitar analíticos
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }
  if (consent === null) return null;

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="fixed bottom-3 left-3 z-40 bg-background shadow-md"
      aria-label="Revisar preferências de cookies"
      title="Revisar preferências de cookies"
      onClick={() => setIsOpen(true)}
    >
      <Cookie aria-hidden />
    </Button>
  );
}
