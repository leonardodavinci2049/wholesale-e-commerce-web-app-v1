"use server";

import type { RowDataPacket } from "mysql2/promise";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { createLogger } from "@/core/logger";
import dbService from "@/database/dbConnection";
import { AUTH_TABLES } from "@/database/shared/auth/auth.types";
import { CACHE_TAGS } from "@/lib/cache-config";
import { getAuthContext } from "@/server/auth-context";
import {
  CustomerInlineError,
  customerInlineServiceApi,
} from "@/services/api-main/customer-inline";
import { SellerError, sellerServiceApi } from "@/services/api-main/seller";

const logger = createLogger("user-seller-actions");

const SearchSchema = z.string().trim().max(300, "Pesquisa muito longa");
const UpdateSellerSchema = z.object({
  userId: z.string().min(1, "ID do usuário é obrigatório").max(128),
  sellerId: z.number().int().positive("ID do vendedor inválido"),
});

export type SellerOption = {
  id: number;
  name: string;
  imagePath: string | null;
};

export type SearchSellersResult =
  | { success: true; sellers: SellerOption[] }
  | { success: false; message: string; sellers: [] };

export type UpdateUserSellerResult =
  | { success: true; message: string; sellerId: number }
  | { success: false; message: string };

interface UserSellerRow extends RowDataPacket {
  id: string;
  personId: number | null;
  sellerId: number | null;
}

async function getAdminApiContext() {
  const context = await getAuthContext();

  if (context.session.user.role !== "admin") {
    throw new Error("Sem permissão para editar usuários");
  }

  return context.apiContext;
}

export async function searchSellersAction(
  search: string,
): Promise<SearchSellersResult> {
  const parsed = SearchSchema.safeParse(search);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Pesquisa inválida",
      sellers: [],
    };
  }

  try {
    const apiContext = await getAdminApiContext();
    const response = await sellerServiceApi.searchAllSellers({
      ...apiContext,
      pe_search: parsed.data || undefined,
    });

    if (!sellerServiceApi.isValidSellerSearchList(response)) {
      return {
        success: false,
        message: response.message || "Falha ao carregar vendedores",
        sellers: [],
      };
    }

    const sellers = sellerServiceApi
      .extractSearchSellers(response)
      .filter(
        (seller) =>
          Number.isInteger(seller.ID_CUSTOMER) && seller.ID_CUSTOMER > 0,
      )
      .map((seller) => ({
        id: seller.ID_CUSTOMER,
        name: seller.NOME,
        imagePath: seller.PATH_IMAGEM,
      }));

    return { success: true, sellers };
  } catch (error) {
    logger.error("Erro ao buscar vendedores para o usuário", error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Falha ao carregar vendedores",
      sellers: [],
    };
  }
}

export async function updateUserSellerAction(input: {
  userId: string;
  sellerId: number;
}): Promise<UpdateUserSellerResult> {
  const parsed = UpdateSellerSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  const { sellerId, userId } = parsed.data;
  let previousSellerId: number | null = null;
  let localUpdateCompleted = false;

  try {
    const apiContext = await getAdminApiContext();
    const users = await dbService.selectExecute<UserSellerRow>(
      `SELECT id, personId, sellerId FROM ${AUTH_TABLES.USER} WHERE id = ? LIMIT 1`,
      [userId],
    );
    const user = users[0];

    if (!user) {
      return { success: false, message: "Usuário não encontrado" };
    }

    if (!user.personId || user.personId <= 0) {
      return {
        success: false,
        message: "O usuário não possui um ID de cliente válido",
      };
    }

    if (user.sellerId === sellerId) {
      return {
        success: true,
        message: "Este vendedor já é o padrão do usuário",
        sellerId,
      };
    }

    const sellerResponse = await sellerServiceApi.findSellerById({
      ...apiContext,
      pe_seller_id: sellerId,
    });
    const selectedSeller = sellerServiceApi.extractSellerById(sellerResponse);

    if (
      !sellerServiceApi.isValidSellerDetail(sellerResponse) ||
      selectedSeller?.ID_SELLER !== sellerId
    ) {
      return { success: false, message: "Vendedor não encontrado" };
    }

    previousSellerId = user.sellerId;
    const localUpdate = await dbService.modifyExecute(
      `UPDATE ${AUTH_TABLES.USER}
       SET sellerId = ?, updatedAt = NOW()
       WHERE id = ? AND sellerId <=> ?`,
      [sellerId, userId, previousSellerId],
    );

    if (localUpdate.affectedRows !== 1) {
      return {
        success: false,
        message:
          "O usuário foi alterado por outra operação. Recarregue a lista.",
      };
    }

    localUpdateCompleted = true;

    try {
      await customerInlineServiceApi.updateSellerId({
        ...apiContext,
        pe_customer_id: user.personId,
        pe_seller_id: sellerId,
      });
    } catch (backendError) {
      const rollback = await dbService.modifyExecute(
        `UPDATE ${AUTH_TABLES.USER}
         SET sellerId = ?, updatedAt = NOW()
         WHERE id = ? AND sellerId = ?`,
        [previousSellerId, userId, sellerId],
      );
      localUpdateCompleted = rollback.affectedRows !== 1;

      if (localUpdateCompleted) {
        logger.error(
          "Falha ao restaurar sellerId local após erro no backend",
          backendError,
        );
        return {
          success: false,
          message:
            "A atualização não pôde ser concluída de forma consistente. Recarregue a lista e tente novamente.",
        };
      }

      if (backendError instanceof CustomerInlineError) {
        return { success: false, message: backendError.message };
      }

      return {
        success: false,
        message:
          "Não foi possível atualizar o vendedor no backend. A alteração local foi revertida.",
      };
    }

    revalidatePath("/dashboard/users");
    revalidatePath(`/dashboard/users/${userId}`);
    revalidateTag(CACHE_TAGS.customer(String(user.personId)), "seconds");
    revalidateTag(CACHE_TAGS.customers, "seconds");

    return {
      success: true,
      message: "Vendedor padrão atualizado com sucesso",
      sellerId,
    };
  } catch (error) {
    logger.error("Erro ao atualizar vendedor padrão do usuário", error);

    if (localUpdateCompleted) {
      return {
        success: false,
        message:
          "A atualização ficou incompleta. Recarregue a lista antes de tentar novamente.",
      };
    }

    if (error instanceof SellerError || error instanceof CustomerInlineError) {
      return { success: false, message: error.message };
    }

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Falha ao atualizar vendedor padrão",
    };
  }
}
