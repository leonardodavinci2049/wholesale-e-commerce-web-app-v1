"use client";

import type { UserWithRole } from "better-auth/plugins/admin";
import {
  KeyRound,
  MoreHorizontal,
  ShieldAlert,
  UserCheck,
  UserCog,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth/auth-client";

interface UserActionsProps {
  user: UserWithRole;
  selfId: string;
}

export function UserActions({ user, selfId }: UserActionsProps) {
  const { refetch } = authClient.useSession();
  const router = useRouter();
  const isSelf = user.id === selfId;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  function handleImpersonateUser(userId: string) {
    authClient.admin.impersonateUser(
      { userId },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to impersonate");
        },
        onSuccess: () => {
          refetch();
          router.push("/");
        },
      },
    );
  }

  function handleBanUser(userId: string) {
    authClient.admin.banUser(
      { userId },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to ban user");
        },
        onSuccess: () => {
          toast.success("User banned");
          router.refresh();
        },
      },
    );
  }

  function handleUnbanUser(userId: string) {
    authClient.admin.unbanUser(
      { userId },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to unban user");
        },
        onSuccess: () => {
          toast.success("User unbanned");
          router.refresh();
        },
      },
    );
  }

  function handleRevokeSessions(userId: string) {
    authClient.admin.revokeUserSessions(
      { userId },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to revoke user sessions");
        },
        onSuccess: () => {
          toast.success("User sessions revoked");
        },
      },
    );
  }

  function handleRemoveUser(userId: string) {
    authClient.admin.removeUser(
      { userId },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to delete user");
        },
        onSuccess: () => {
          toast.success("User deleted");
          setShowDeleteDialog(false);
          router.refresh();
        },
      },
    );
  }

  if (isSelf) return null;

  return (
    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleImpersonateUser(user.id)}>
            <UserCog className="mr-2 h-4 w-4" />
            Personificar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleRevokeSessions(user.id)}>
            <KeyRound className="mr-2 h-4 w-4" />
            Revogar Sessões
          </DropdownMenuItem>
          {user.banned ? (
            <DropdownMenuItem onClick={() => handleUnbanUser(user.id)}>
              <UserCheck className="mr-2 h-4 w-4 text-green-600" />
              Desbanir Usuário
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => handleBanUser(user.id)}>
              <ShieldAlert className="mr-2 h-4 w-4 text-orange-600" />
              Banir Usuário
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Usuário</AlertDialogTitle>
          <AlertDialogDescription>
            Você tem certeza que deseja excluir este usuário? Esta ação não pode
            ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleRemoveUser(user.id)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
