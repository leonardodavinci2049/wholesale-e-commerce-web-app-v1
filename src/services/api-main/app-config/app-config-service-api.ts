import "server-only";

import { serverEnvs } from "@/core/config/envs.server";
import {
  API_STATUS_CODES,
  APP_CONFIG_ENDPOINTS,
  isApiError,
  isApiSuccess,
} from "@/core/constants/api-constants";
import { createLogger } from "@/core/logger";
import { BaseApiService } from "@/lib/axios/base-api-service";

import type {
  AppConfigEntity,
  AppConfigFindAllRequest,
  AppConfigFindAllResponse,
  AppConfigFindByIdRequest,
  AppConfigFindByIdResponse,
  AppConfigUpdateGeneralFieldRequest,
  AppConfigUpdateGeneralFieldResponse,
  AppMenuEntity,
  AppMenuFindByTypeRequest,
  AppMenuFindByTypeResponse,
  StoredProcedureResponse,
} from "./types/app-config-types";
import {
  AppConfigError,
  AppConfigNotFoundError,
} from "./types/app-config-types";
import {
  AppConfigFindAllSchema,
  AppConfigFindByIdSchema,
  AppConfigUpdateGeneralFieldSchema,
  AppMenuFindByTypeSchema,
} from "./validation/app-config-schemas";

const logger = createLogger("AppConfigServiceApi");

export class AppConfigServiceApi extends BaseApiService {
  private buildBasePayload(
    additionalData: Record<string, unknown> = {},
  ): Record<string, unknown> {
    return {
      pe_app_id: serverEnvs.APP_ID,
      pe_store_id: serverEnvs.STORE_ID,
      ...additionalData,
      pe_system_client_id: serverEnvs.SYSTEM_CLIENT_ID,
      pe_organization_id: serverEnvs.ORGANIZATION_ID,
    };
  }

  async findAllAppConfigs(
    params: AppConfigFindAllRequest,
  ): Promise<AppConfigFindAllResponse> {
    try {
      const validatedParams = AppConfigFindAllSchema.parse(params);
      const requestBody = this.buildBasePayload(validatedParams);

      const response = await this.post<AppConfigFindAllResponse>(
        APP_CONFIG_ENDPOINTS.FIND_ALL,
        requestBody,
      );

      return this.normalizeEmptyAppConfigFindAllResponse(response);
    } catch (error) {
      logger.error("Erro ao buscar configurações do app", error);
      throw error;
    }
  }

  async findAppConfigById(
    params: AppConfigFindByIdRequest,
  ): Promise<AppConfigFindByIdResponse> {
    try {
      const validatedParams = AppConfigFindByIdSchema.parse(params);
      const requestBody = this.buildBasePayload(validatedParams);

      const response = await this.post<AppConfigFindByIdResponse>(
        APP_CONFIG_ENDPOINTS.FIND_BY_ID,
        requestBody,
      );

      if (response.statusCode === API_STATUS_CODES.NOT_FOUND) {
        throw new AppConfigNotFoundError(validatedParams);
      }

      if (isApiError(response.statusCode)) {
        throw new AppConfigError(
          response.message || "Erro ao buscar configuração do app por ID",
          "APP_CONFIG_FIND_BY_ID_ERROR",
          response.statusCode,
        );
      }

      return response;
    } catch (error) {
      logger.error("Erro ao buscar configuração do app por ID", error);
      throw error;
    }
  }

  async updateAppConfigGeneralField(
    params: AppConfigUpdateGeneralFieldRequest,
  ): Promise<AppConfigUpdateGeneralFieldResponse> {
    try {
      const validatedParams = AppConfigUpdateGeneralFieldSchema.parse(params);
      const requestBody = this.buildBasePayload(validatedParams);

      const response = await this.post<AppConfigUpdateGeneralFieldResponse>(
        APP_CONFIG_ENDPOINTS.UPD_GENERAL_FIELD,
        requestBody,
      );

      this.checkStoredProcedureError(response);
      return response;
    } catch (error) {
      logger.error("Erro ao atualizar campo da configuração do app", error);
      throw error;
    }
  }

  async findAppMenuByType(
    params: AppMenuFindByTypeRequest,
  ): Promise<AppMenuFindByTypeResponse> {
    try {
      const validatedParams = AppMenuFindByTypeSchema.parse(params);
      const requestBody = this.buildBasePayload(validatedParams);

      const response = await this.post<AppMenuFindByTypeResponse>(
        APP_CONFIG_ENDPOINTS.MENU_FIND_TYPE,
        requestBody,
      );

      return this.normalizeEmptyAppMenuFindByTypeResponse(response);
    } catch (error) {
      logger.error("Erro ao buscar menu do app por tipo", error);
      throw error;
    }
  }

  private checkStoredProcedureError(
    response: AppConfigUpdateGeneralFieldResponse,
  ): void {
    const spResponse = response.data?.[0] as StoredProcedureResponse;
    if (spResponse && spResponse.sp_error_id !== 0) {
      throw new AppConfigError(
        spResponse.sp_message || "Erro na operação de configuração do app",
        "APP_CONFIG_OPERATION_ERROR",
        spResponse.sp_error_id,
      );
    }
  }

  private normalizeEmptyAppConfigFindAllResponse(
    response: AppConfigFindAllResponse,
  ): AppConfigFindAllResponse {
    if (
      response.statusCode === API_STATUS_CODES.NOT_FOUND ||
      response.statusCode === API_STATUS_CODES.EMPTY_RESULT
    ) {
      return {
        ...response,
        statusCode: API_STATUS_CODES.SUCCESS,
        quantity: 0,
        data: {
          "App Config": [],
        },
      };
    }
    return response;
  }

  private normalizeEmptyAppMenuFindByTypeResponse(
    response: AppMenuFindByTypeResponse,
  ): AppMenuFindByTypeResponse {
    if (
      response.statusCode === API_STATUS_CODES.NOT_FOUND ||
      response.statusCode === API_STATUS_CODES.EMPTY_RESULT
    ) {
      return {
        ...response,
        statusCode: API_STATUS_CODES.SUCCESS,
        quantity: 0,
        data: {
          "App Menu": [],
        },
      };
    }
    return response;
  }

  extractAppConfigs(response: AppConfigFindAllResponse): AppConfigEntity[] {
    return response.data?.["App Config"] ?? [];
  }

  extractAppConfigById(
    response: AppConfigFindByIdResponse,
  ): AppConfigEntity | null {
    return response.data?.["App Config"]?.[0] ?? null;
  }

  extractAppMenus(response: AppMenuFindByTypeResponse): AppMenuEntity[] {
    return response.data?.["App Menu"] ?? [];
  }

  extractStoredProcedureResult(
    response: AppConfigUpdateGeneralFieldResponse,
  ): StoredProcedureResponse | null {
    return (response.data?.[0] as StoredProcedureResponse) ?? null;
  }

  isValidAppConfigList(response: AppConfigFindAllResponse): boolean {
    return (
      isApiSuccess(response.statusCode) &&
      response.data &&
      Array.isArray(response.data["App Config"])
    );
  }

  isValidAppConfigDetail(response: AppConfigFindByIdResponse): boolean {
    return (
      isApiSuccess(response.statusCode) &&
      response.data &&
      Array.isArray(response.data["App Config"]) &&
      response.data["App Config"].length > 0
    );
  }

  isValidAppMenuList(response: AppMenuFindByTypeResponse): boolean {
    return (
      isApiSuccess(response.statusCode) &&
      response.data &&
      Array.isArray(response.data["App Menu"])
    );
  }
}

export const appConfigServiceApi = new AppConfigServiceApi();
