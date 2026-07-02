"use client";

import { useEffect } from "react";
import { trackEvent } from "../_lib/tracking";

/**
 * Dispara o evento `register_landing_view` quando a landing é montada no cliente.
 * Renderiza `null` — é apenas um ponto de tracking.
 */
export function RegisterViewTracker() {
  useEffect(() => {
    trackEvent("register_landing_view");
  }, []);

  return null;
}
