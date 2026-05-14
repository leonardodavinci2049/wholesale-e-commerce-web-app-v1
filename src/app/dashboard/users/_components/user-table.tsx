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

type UserWithPersonId = UserWithRole;

interface UserTableProps {
  users: UserWithPersonId[];
  selfId: string;
}

export function UserTable({ users, selfId }: UserTableProps) {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary hover:bg-secondary">
              <TableHead className="w-12">Avatar</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>E-mail</TableHead>
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
                    <AvatarImage src={user.image || ""} alt={user.name || ""} />
                    <AvatarFallback>
                      {(user.name || "U").substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
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
                <TableCell className="text-right">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/dashboard/users/${user.id}`}>Ver</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
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
          <div
            key={user.id}
            className="rounded-lg border bg-card p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Avatar>
                  <AvatarImage src={user.image || ""} alt={user.name || ""} />
                  <AvatarFallback>
                    {(user.name || "U").substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/users/${user.id}`}
                      className="font-medium hover:underline text-blue-600 dark:text-blue-400 block truncate"
                    >
                      {user.name || "Sem nome"}
                    </Link>
                    {user.id === selfId && (
                      <Badge
                        variant="outline"
                        className="text-[10px] py-0 px-1 shrink-0"
                      >
                        Você
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </div>

              <Button asChild variant="outline" size="sm">
                <Link href={`/dashboard/users/${user.id}`}>Ver</Link>
              </Button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                {user.role}
              </Badge>
              {user.banned && <Badge variant="destructive">Banido</Badge>}
              {!user.emailVerified && (
                <Badge variant="outline">Não verif.</Badge>
              )}
            </div>

            <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
              <span>Criado em</span>
              <span>
                {new Intl.DateTimeFormat("pt-BR", {
                  dateStyle: "medium",
                }).format(new Date(user.createdAt))}
              </span>
            </div>
          </div>
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
