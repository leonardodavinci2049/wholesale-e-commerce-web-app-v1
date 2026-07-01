import "server-only";

import { MESSAGES } from "@/core/constants/globalConstants";
import { createLogger } from "@/core/logger";

import dbService from "@/database/dbConnection";
import { processProcedureResultMutation } from "@/database/utils/process-procedure-result.mutation";
import { processProcedureResultQueryWithoutId } from "@/database/utils/process-procedure-result.query";
import { ResultModel } from "@/database/utils/result.model";
import { validateLogLoginCreateDto } from "./dto/log_login_create.dto";
import { validateLogLoginFindAllDto } from "./dto/log_login_find_all.dto";
import { validateLogOperationCreateDto } from "./dto/log_operation_create.dto";
import { validateLogOperationFindAllDto } from "./dto/log_operation_find_all.dto";
import { LogLoginCreateQuery } from "./query/log_login_create.query";
import { LogLoginFindAllQuery } from "./query/log_login_find_all.query";
import { LogOperationCreateQuery } from "./query/log_operation_create.query";
import { LogOperationFindAllQuery } from "./query/log_operation_find_all.query";
import type {
  SpResultRecordCreateType,
  SpResultRecordLoginFindAllType,
  SpResultRecordOperationFindAllType,
  TblLogLoginFindAll,
  TblLoglogOperationFindAll,
} from "./types/log.type";

const logger = createLogger("LogService");

export class LogService {
  async execLogLoginCreateQuery(dataJsonDto: unknown): Promise<ResultModel> {
    try {
      const validatedDto = validateLogLoginCreateDto(dataJsonDto);

      const queryString = await LogLoginCreateQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordCreateType;

      return processProcedureResultMutation(
        resultData as unknown[],
        "Login log creation failed",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }

  async execLogLoginFindAllQuery(dataJsonDto: unknown): Promise<ResultModel> {
    try {
      const validatedDto = validateLogLoginFindAllDto(dataJsonDto);

      const queryString = await LogLoginFindAllQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordLoginFindAllType;

      return processProcedureResultQueryWithoutId<TblLogLoginFindAll>(
        resultData as unknown[],
        "Login logs not found",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }

  async execLogOperationCreateQuery(
    dataJsonDto: unknown,
  ): Promise<ResultModel> {
    try {
      const validatedDto = validateLogOperationCreateDto(dataJsonDto);

      const queryString = await LogOperationCreateQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordCreateType;

      return processProcedureResultMutation(
        resultData as unknown[],
        "Operation log creation failed",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }

  async execLogOperationFindAllQuery(
    dataJsonDto: unknown,
  ): Promise<ResultModel> {
    try {
      const validatedDto = validateLogOperationFindAllDto(dataJsonDto);

      const queryString = await LogOperationFindAllQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordOperationFindAllType;

      return processProcedureResultQueryWithoutId<TblLoglogOperationFindAll>(
        resultData as unknown[],
        "Operation logs not found",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }
}

const logService = new LogService();
export default logService;

export type LogLoginListItem = {
  log_id: number;
  app_id: number;
  organization_Id: string;
  organization_name: string;
  user_id: string;
  user_name: string;
  user_email: string;
  module_id: number;
  record_id: string;
  log: string;
  note: string;
  createdAt: Date;
};

export type LogOperationListItem = {
  log_id: number;
  app_id: number;
  app_name: string;
  organization_Id: string;
  organization_name: string;
  user_id: string;
  user_name: string;
  module_id: number;
  record_id: string;
  log: string;
  note: string;
  createdAt: Date;
};

function transformLogLogin(log: TblLogLoginFindAll): LogLoginListItem {
  return {
    log_id: log.log_id,
    app_id: log.app_id,
    organization_Id: log.organization_Id,
    organization_name: log.organization_name,
    user_id: log.user_id,
    user_name: log.user_name,
    user_email: log.user_email,
    module_id: Number(log.module_id),
    record_id: log.record_id,
    log: log.log,
    note: log.note,
    createdAt: log.createdAt,
  };
}

function transformLogOperation(
  log: TblLoglogOperationFindAll,
): LogOperationListItem {
  return {
    log_id: log.log_id,
    app_id: log.app_id,
    app_name: log.app_name,
    organization_Id: log.organization_Id,
    organization_name: log.organization_name,
    user_id: log.user_id,
    user_name: log.user_name,
    module_id: Number(log.module_id),
    record_id: log.record_id,
    log: log.log,
    note: log.note,
    createdAt: log.createdAt,
  };
}

export async function getAllLoginLogs(
  organizationId?: string,
  userId?: string,
  searchTerm?: string,
  limit?: number,
): Promise<LogLoginListItem[]> {
  try {
    const response = await logService.execLogLoginFindAllQuery({
      PE_ORGANIZATION_ID: organizationId,
      PE_USER_ID: userId,
      PE_SEARCH_USER: searchTerm,
      PE_LIMIT: limit,
    });

    if (response.statusCode !== 100200 || !response.data) {
      logger.error("Error loading login logs:", response.message);
      return [];
    }

    const rawLogs = Array.isArray(response.data) ? response.data : [];

    return rawLogs.map(transformLogLogin);
  } catch (error) {
    logger.error("Failed to fetch login logs:", error);
    return [];
  }
}

export async function getAllOperationLogs(
  organizationId?: string,
  userId?: string,
  searchTerm?: string,
  limit?: number,
): Promise<LogOperationListItem[]> {
  try {
    const response = await logService.execLogOperationFindAllQuery({
      PE_ORGANIZATION_ID: organizationId,
      PE_USER_ID: userId,
      PE_SEARCH_USER: searchTerm,
      PE_LIMIT: limit,
    });

    if (response.statusCode !== 100200 || !response.data) {
      logger.error("Error loading operation logs:", response.message);
      return [];
    }

    const rawLogs = Array.isArray(response.data) ? response.data : [];

    return rawLogs.map(transformLogOperation);
  } catch (error) {
    logger.error("Failed to fetch operation logs:", error);
    return [];
  }
}
