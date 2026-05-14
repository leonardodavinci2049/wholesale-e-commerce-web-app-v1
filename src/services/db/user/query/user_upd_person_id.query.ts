import { envs } from "@/core/config";
import type { UserUpdPersonIdDto } from "../dto/user_upd_person_id.dto";

export function UserUpdPersonIdQuery(dataJsonDto: UserUpdPersonIdDto): string {
  const PE_APP_ID = envs.APP_ID;
  const PE_ORGANIZATION_ID = dataJsonDto.PE_ORGANIZATION_ID;
  const PE_USER_ID = dataJsonDto.PE_USER_ID;
  const PE_PERSON_ID = dataJsonDto.PE_PERSON_ID;

  const queryString = ` call sp_user_upd_person_id_v1(
        ${PE_APP_ID},
        '${PE_ORGANIZATION_ID || "null"}',
        '${PE_USER_ID || "null"}',
        ${PE_PERSON_ID || "null"}
        ) `;

  return queryString;
}
