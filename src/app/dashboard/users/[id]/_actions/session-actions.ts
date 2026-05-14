"use server";

import { revalidatePath } from "next/cache";
import { SessionService } from "@/services/db/session/session.service";

export async function revokeUserSession(sessionId: string) {
  const result = await SessionService.deleteSession({ sessionId });

  if (result.success) {
    revalidatePath("/dashboard/users");
  }

  return result;
}
