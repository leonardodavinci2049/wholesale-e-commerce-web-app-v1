"use server";

import { revalidatePath } from "next/cache";
import { AccountService } from "@/services/db/account/account.service";

export async function unlinkUserAccount(accountId: string) {
  const result = await AccountService.deleteAccount({ accountId });

  if (result.success) {
    revalidatePath("/dashboard/users");
  }

  return result;
}
