"use client";

import { AlertCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";
import { LoadingSwap } from "@/components/auth/loading-swap";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  type DeleteUserActionState,
  deleteUserAction,
} from "../_actions/user-actions";

interface UserDeletionProps {
  userId: string;
  userName: string;
}

export function UserDeletion({ userId, userName }: UserDeletionProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [state, formAction] = useActionState<DeleteUserActionState, FormData>(
    deleteUserAction,
    { success: false, message: "" },
  );

  async function handleSubmit(formData: FormData) {
    setIsDeleting(true);
    formData.set("userId", userId);

    const form = document.createElement("form");
    form.action = "/dashboard/users/[id]/_actions/user-actions";
    form.method = "POST";

    const result = await fetch("/dashboard/users/[id]/_actions/user-actions", {
      method: "POST",
      body: formData,
    });

    const response = await result.json();
    setIsDeleting(false);

    if (response.success) {
      setIsDialogOpen(false);
      router.push("/dashboard/users");
      router.refresh();
    }
  }

  return (
    <Card className="border border-destructive">
      <CardHeader>
        <CardTitle className="text-destructive">Excluir Usuário</CardTitle>
        <CardDescription>
          Exclua permanentemente este usuário e todos os dados associados. Esta
          ação não pode ser desfeita.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Atenção</AlertTitle>
            <AlertDescription>
              Ao excluir o usuário <strong>{userName}</strong>, todos os dados
              associados a ele serão removidos permanentemente do sistema.
            </AlertDescription>
          </Alert>

          <form action={formAction}>
            <input type="hidden" name="userId" value={userId} />

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir Usuário Permanentemente
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmar Exclusão</DialogTitle>
                  <DialogDescription>
                    Tem certeza que deseja excluir o usuário{" "}
                    <strong>{userName}</strong>? Esta ação não pode ser
                    desfeita.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isDeleting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="destructive"
                    disabled={isDeleting}
                    onClick={(e) => {
                      e.preventDefault();
                      const formData = new FormData();
                      formData.set("userId", userId);
                      handleSubmit(formData);
                    }}
                  >
                    <LoadingSwap isLoading={isDeleting}>
                      Confirmar Exclusão
                    </LoadingSwap>
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </form>

          {state.message && !state.success && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
