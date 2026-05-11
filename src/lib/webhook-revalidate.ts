import { serverEnvs } from "@/core/config/envs.server";
import { createLogger } from "@/core/logger";

const logger = createLogger("webhookRevalidate");

/**
 * Maps each application ID to its corresponding revalidation webhook URL.
 * Add new entries here as more apps are added.
 */
const WEBHOOK_URL_BY_APP_ID: Record<number, string | undefined> = {
  1: serverEnvs.WEBHOOK_REVALIDATE_URL1,
  2: serverEnvs.WEBHOOK_REVALIDATE_URL2,
};

/**
 * Sends a POST request to the revalidation webhook for the given app.
 * Errors are logged but never thrown — a failed webhook must not block the main action.
 */
export async function triggerRevalidateWebhook(appId: number): Promise<void> {
  const url = WEBHOOK_URL_BY_APP_ID[appId];

  if (!url) {
    logger.warn("No revalidation webhook configured for appId", { appId });
    return;
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "x-revalidate-secret": serverEnvs.REVALIDATE_SECRET,
      },
    });

    if (!response.ok) {
      logger.warn("Revalidation webhook returned non-OK status", {
        appId,
        url,
        status: response.status,
      });
    }
  } catch (error) {
    logger.error("Failed to call revalidation webhook", { appId, url, error });
  }
}
