import { envs } from "@/core/config";
import type { UserUpdNameDto } from "../dto/user_upd_name.dto";

export function UserUpdNameQuery(dataJsonDto: UserUpdNameDto): string {
  const PE_APP_ID = envs.APP_ID;
  const PE_ORGANIZATION_ID = dataJsonDto.PE_ORGANIZATION_ID;
  const PE_USER_ID = dataJsonDto.PE_USER_ID;
  const PE_USER_NAME = dataJsonDto.PE_USER_NAME;

  const queryString = ` call sp_user_upd_name_v1(
        ${PE_APP_ID},
        '${PE_ORGANIZATION_ID || "null"}',
        '${PE_USER_ID || "null"}',
        '${PE_USER_NAME || "null"}'
        ) `;

  return queryString;
}
