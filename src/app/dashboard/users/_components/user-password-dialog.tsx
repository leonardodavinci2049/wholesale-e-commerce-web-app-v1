"use client";

import { Copy, KeyRound, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { generateUserPasswordAction } from "./generate-user-password-action";

type UserPasswordDialogProps = {
  userId: string;
  userName: string | null | undefined;
  userEmail: string | null | undefined;
};

export function UserPasswordDialog({
  userId,
  userName,
  userEmail,
}: UserPasswordDialogProps) {
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [content, setContent] = useState("");

  const displayName = userName || "usuário";
  const email = userEmail || "";

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      setContent("");
    }
  };

  const handleGeneratePassword = async () => {
    setIsGenerating(true);

    try {
      const result = await generateUserPasswordAction(userId);

      if (!result.success || !result.password) {
        toast.error(result.error || "Falha ao gerar senha");
        return;
      }

      setContent(
        [
          "Segue os dados de acesso ao sistema",
          `Email: ${email}`,
          `Senha: ${result.password}`,
        ].join("\n"),
      );
      toast.success("Senha gerada com sucesso");
    } catch (_error) {
      toast.error("Ocorreu um erro ao gerar a senha");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Conteúdo copiado para a área de transferência");
    } catch (_error) {
      toast.error("Falha ao copiar conteúdo");
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
      >
        <KeyRound className="mr-1 size-4" />
        Senha
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Gerar Senha</DialogTitle>
            <DialogDescription>
              Gere uma nova senha para <strong>{displayName}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Textarea
              readOnly
              rows={3}
              value={content}
              placeholder="Clique em 'Gerar Senha' para criar uma nova senha"
              className="resize-none"
            />
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <DialogClose asChild>
              <Button variant="outline">Fechar</Button>
            </DialogClose>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCopy}
                disabled={!content}
              >
                <Copy className="mr-1 size-4" />
                Copiar
              </Button>
              <Button
                type="button"
                onClick={handleGeneratePassword}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  "Gerar Senha"
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
