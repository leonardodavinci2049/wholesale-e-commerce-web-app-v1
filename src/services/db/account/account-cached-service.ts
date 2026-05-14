import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { createLogger } from "@/core/logger";
import type { Account } from "@/database/shared/auth/auth.types";
import { CACHE_TAGS } from "@/lib/cache-config";
import AccountService from "./account.service";

const logger = createLogger("AccountCachedService");

export async function getAccountsByUserId(userId: string): Promise<Account[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.account(userId), CACHE_TAGS.accounts);

  try {
    const response = await AccountService.findAccountsByUserId({ userId });

    if (!response.success || !response.data) {
      logger.error("Error loading accounts:", response.error);
      return [];
    }

    return response.data;
  } catch (error) {
    logger.error(`Failed to fetch accounts for user ${userId}:`, error);
    return [];
  }
}
