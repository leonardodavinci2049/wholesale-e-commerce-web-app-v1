import { envs } from "@/core/config";
import type { UserFindAllDto } from "../dto/user_find_all.dto";

export function UserFindAllQuery(dataJsonDto: UserFindAllDto): string {
  const PE_APP_ID = envs.APP_ID;
  const PE_USER_ID = dataJsonDto.PE_USER_ID;
  const PE_ORGANIZATION_ID = dataJsonDto.PE_ORGANIZATION_ID;
  const PE_SEARCH_USER = dataJsonDto.PE_SEARCH_USER;
  const PE_FLAG_MEMBER_OFF = dataJsonDto.PE_FLAG_MEMBER_OFF;
  const PE_QT_REGISTROS = dataJsonDto.PE_QT_REGISTROS;
  const PE_PAGINA_ID = dataJsonDto.PE_PAGINA_ID;
  const PE_COLUNA_ID = dataJsonDto.PE_COLUNA_ID;
  const PE_ORDEM_ID = dataJsonDto.PE_ORDEM_ID;

  const queryString = ` call sp_user_find_all_v1(
        ${PE_APP_ID},
        '${PE_ORGANIZATION_ID || "null"}',
        '${PE_USER_ID || "null"}',
        '${PE_SEARCH_USER || "null"}',
        ${PE_FLAG_MEMBER_OFF || 0},
        ${PE_QT_REGISTROS || 20},
        ${PE_PAGINA_ID || 1},
        ${PE_COLUNA_ID || 1},
        ${PE_ORDEM_ID || 1}
        ) `;

  return queryString;
}
