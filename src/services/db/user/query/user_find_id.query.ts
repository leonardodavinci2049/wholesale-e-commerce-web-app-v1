import { serverEnvs } from "@/core/config/envs.server";
import type { UserFindIdDto } from "../dto/user_find_id.dto";

export function UserFindIdQuery(dataJsonDto: UserFindIdDto): string {
  const PE_APP_ID = serverEnvs.APP_ID;
  const PE_USER_ID = dataJsonDto.PE_USER_ID;

  const queryString = ` call sp_user_find_id_v1(
        ${PE_APP_ID},
        '${PE_USER_ID || "null"}'
        ) `;

  return queryString;
}
