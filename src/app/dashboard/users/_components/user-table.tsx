import type { UserWithRole } from "better-auth/plugins/admin";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SellerIdEditor } from "./seller-id-editor";
import { UserPasswordDialog } from "./user-password-dialog";

type UserWithCustomerAndSellerIds = UserWithRole & {
  personId?: number | null;
  sellerId?: number | null;
};

interface UserTableProps {
  users: UserWithCustomerAndSellerIds[];
  selfId: string;
}

const DEFAULT_USER_IMAGE = "/images/user/default-user-image.png";

export function UserTable({ users, selfId }: UserTableProps) {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader className="[&_th]:font-semibold [&_th]:text-secondary-foreground">
            <TableRow className="bg-secondary hover:bg-secondary">
              <TableHead className="w-12">Avatar</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Vendedor</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.image || DEFAULT_USER_IMAGE}
                      alt={user.name || "Usuário sem nome"}
                    />
                    <AvatarFallback>
                      {(user.name || "U").substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <span className="shrink-0 text-muted-foreground">
                      {user.personId != null ? `#${user.personId}` : "—"}
                    </span>
                    <Link
                      href={`/dashboard/users/${user.id}`}
                      className="hover:underline text-blue-600 dark:text-blue-400"
                    >
                      {user.name || "Sem nome"}
                    </Link>
                    {user.id === selfId && (
                      <Badge
                        variant="outline"
                        className="text-[10px] py-0 px-1"
                      >
                        Você
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {user.email}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <SellerIdEditor
                    userId={user.id}
                    userName={user.name || "Sem nome"}
                    personId={user.personId ?? null}
                    sellerId={user.sellerId ?? null}
                  />
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.role === "admin" ? "default" : "secondary"}
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {user.banned && <Badge variant="destructive">Banido</Badge>}
                    {!user.emailVerified && (
                      <Badge variant="outline">Não verif.</Badge>
                    )}
                    {!user.banned && user.emailVerified && (
                      <Badge
                        variant="outline"
                        className="border-green-500 text-green-600"
                      >
                        Ativo
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {new Intl.DateTimeFormat("pt-BR", {
                    dateStyle: "medium",
                  }).format(new Date(user.createdAt))}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <UserPasswordDialog
                      userId={user.id}
                      userName={user.name}
                      userEmail={user.email}
                    />
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/dashboard/users/${user.id}`}>Ver</Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {users.map((user) => (
          <article
            key={user.id}
            className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 rounded-xl border bg-card px-3 py-2.5 text-card-foreground shadow-sm transition-shadow hover:shadow-md"
          >
            <Avatar className="row-span-4 mt-0.5 size-11">
              <AvatarImage
                src={user.image || DEFAULT_USER_IMAGE}
                alt={user.name || "Usuário sem nome"}
              />
              <AvatarFallback>
                {(user.name || "U").substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <Link
                href={`/dashboard/users/${user.id}`}
                className="block break-words text-sm font-semibold leading-tight text-blue-600 hover:underline dark:text-blue-400"
              >
                {user.name || "Sem nome"}
              </Link>
            </div>

            <div className="mt-0.5 flex min-w-0 flex-wrap items-baseline gap-x-2 text-xs leading-tight text-muted-foreground">
              <span className="shrink-0 font-medium">
                ID {user.personId != null ? `#${user.personId}` : "—"}
              </span>
              <span className="min-w-0 break-all">{user.email}</span>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <span>Vendedor</span>
                <SellerIdEditor
                  userId={user.id}
                  userName={user.name || "Sem nome"}
                  personId={user.personId ?? null}
                  sellerId={user.sellerId ?? null}
                />
              </div>
              <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                {user.role}
              </Badge>
            </div>

            <div className="mt-1 flex flex-wrap items-center justify-between gap-1 text-xs leading-tight text-muted-foreground">
              <span>
                Criado em{" "}
                {new Intl.DateTimeFormat("pt-BR", {
                  dateStyle: "medium",
                }).format(new Date(user.createdAt))}
              </span>
              <div className="flex flex-wrap gap-1">
                {user.id === selfId && (
                  <Badge variant="outline" className="h-4 px-1 text-[10px]">
                    Você
                  </Badge>
                )}
                {user.banned && (
                  <Badge variant="destructive" className="h-4 px-1 text-[10px]">
                    Banido
                  </Badge>
                )}
                {!user.emailVerified && (
                  <Badge variant="outline" className="h-4 px-1 text-[10px]">
                    Não verif.
                  </Badge>
                )}
              </div>
            </div>

            <div className="col-span-2 mt-2 grid grid-cols-2 gap-2 border-t pt-2 [&_button]:w-full">
              <UserPasswordDialog
                userId={user.id}
                userName={user.name}
                userEmail={user.email}
              />
              <Button asChild variant="outline" size="sm">
                <Link href={`/dashboard/users/${user.id}`}>Ver</Link>
              </Button>
            </div>
          </article>
        ))}
        {users.length === 0 && (
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
            Nenhum usuário encontrado.
          </div>
        )}
      </div>
    </>
  );
}
