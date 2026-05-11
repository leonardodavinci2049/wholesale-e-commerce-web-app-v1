import { createAccessControl } from "better-auth/plugins/access";
import {
  adminAc,
  defaultStatements as adminDefaultStatements,
  userAc,
} from "better-auth/plugins/admin/access";

const ac = createAccessControl({
  ...adminDefaultStatements,
} as const);

const user = ac.newRole(userAc.statements);

const admin = ac.newRole({
  ...adminAc.statements,
});

export { ac, admin, user };
