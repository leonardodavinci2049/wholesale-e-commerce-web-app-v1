import Script from "next/script";
import { publicEnvs } from "@/core/config/envs.client";

const CONSENT_STORAGE_KEY = "analytics_consent";

/**
 * Google Analytics 4 Component
 *
 * Loads gtag.js and initializes GA4 tracking.
 * Uses next/script with afterInteractive strategy to minimize impact on LCP.
 *
 * @see https://developers.google.com/analytics/devguides/collection/ga4
 */
export function GoogleAnalytics() {
  const measurementId = publicEnvs.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <>
      <Script id="google-consent-default" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};

          var storedConsent = null;
          try {
            storedConsent = window.localStorage.getItem('${CONSENT_STORAGE_KEY}');
          } catch (error) {
            storedConsent = null;
          }
          var hasConsentChoice = storedConsent === 'granted' || storedConsent === 'denied';
          var analyticsConsent = storedConsent === 'granted' ? 'granted' : 'denied';

          window.gtag('consent', 'default', {
            analytics_storage: analyticsConsent,
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            wait_for_update: hasConsentChoice ? 0 : 500,
          });
        `}
      </Script>

      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />

      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.gtag('js', new Date());
          window.gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
}
