"use server";

import type { RowDataPacket } from "mysql2/promise";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createLogger } from "@/core/logger";
import dbService from "@/database/dbConnection";
import { AUTH_TABLES } from "@/database/shared/auth/auth.types";
import { getAuthContext } from "@/server/auth-context";
import {
  CustomerError,
  CustomerNotFoundError,
  customerGeneralServiceApi,
} from "@/services/api-main/customer-general";

const logger = createLogger("user-whatsapp-actions");

const SyncUserWhatsAppSchema = z.object({
  userId: z.string().min(1, "ID do usuário é obrigatório").max(128),
});

interface UserWhatsAppRow extends RowDataPacket {
  id: string;
  personId: number | null;
  whatsapp: string | null;
}

export type SyncUserWhatsAppResult =
  | { success: true; message: string; whatsapp: string }
  | { success: false; message: string };

export async function syncUserWhatsAppAction(input: {
  userId: string;
}): Promise<SyncUserWhatsAppResult> {
  const parsed = SyncUserWhatsAppSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  const { apiContext, session } = await getAuthContext();

  if (session.user.role !== "admin") {
    return { success: false, message: "Sem permissão para editar usuários" };
  }

  try {
    const users = await dbService.selectExecute<UserWhatsAppRow>(
      `SELECT id, personId, whatsapp
       FROM ${AUTH_TABLES.USER}
       WHERE id = ?
       LIMIT 1`,
      [parsed.data.userId],
    );
    const user = users[0];

    if (!user) {
      return { success: false, message: "Usuário não encontrado" };
    }

    const currentWhatsApp = user.whatsapp?.trim();

    if (currentWhatsApp) {
      return {
        success: true,
        message: "O usuário já possui WhatsApp cadastrado",
        whatsapp: currentWhatsApp,
      };
    }

    if (!user.personId || user.personId <= 0) {
      return {
        success: false,
        message: "O usuário não possui um ID de cliente válido",
      };
    }

    const response = await customerGeneralServiceApi.findCustomerById({
      ...apiContext,
      pe_customer_id: user.personId,
    });
    const customer = customerGeneralServiceApi.extractCustomerById(response);

    if (!customer) {
      return { success: false, message: "Cliente não encontrado" };
    }

    const whatsapp = customer.WHATAPP1?.trim() || customer.FONE1?.trim();

    if (!whatsapp) {
      return {
        success: false,
        message: "O cliente não possui WhatsApp ou telefone cadastrado",
      };
    }

    if (whatsapp.length > 255) {
      return {
        success: false,
        message: "O telefone do cliente excede o limite permitido",
      };
    }

    const update = await dbService.modifyExecute(
      `UPDATE ${AUTH_TABLES.USER}
       SET whatsapp = ?, updatedAt = NOW()
       WHERE id = ? AND NULLIF(TRIM(whatsapp), '') IS NULL`,
      [whatsapp, user.id],
    );

    if (update.affectedRows !== 1) {
      const refreshedUsers = await dbService.selectExecute<UserWhatsAppRow>(
        `SELECT id, personId, whatsapp
         FROM ${AUTH_TABLES.USER}
         WHERE id = ?
         LIMIT 1`,
        [user.id],
      );
      const refreshedWhatsApp = refreshedUsers[0]?.whatsapp?.trim();

      if (refreshedWhatsApp) {
        return {
          success: true,
          message: "O WhatsApp do usuário já havia sido atualizado",
          whatsapp: refreshedWhatsApp,
        };
      }

      return {
        success: false,
        message: "Não foi possível atualizar o WhatsApp do usuário",
      };
    }

    revalidatePath("/dashboard/users");
    revalidatePath(`/dashboard/users/${user.id}`);

    return {
      success: true,
      message: "WhatsApp atualizado a partir do cadastro do cliente",
      whatsapp,
    };
  } catch (error) {
    logger.error("Erro ao sincronizar WhatsApp do usuário", error);

    if (error instanceof CustomerNotFoundError) {
      return { success: false, message: "Cliente não encontrado" };
    }

    if (error instanceof CustomerError) {
      return { success: false, message: error.message };
    }

    return {
      success: false,
      message: "Falha ao consultar e atualizar o WhatsApp",
    };
  }
}
