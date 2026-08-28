"use client";

import { Copy, KeyRound, Loader2, MessageCircle } from "lucide-react";
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

async function copyToClipboard(value: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      // Tenta o fallback abaixo para navegadores móveis incompatíveis.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.readOnly = true;
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "-9999px";
  textarea.style.fontSize = "16px";

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    textarea.remove();
  }
}

function normalizeBrazilianPhone(value: string): string | null {
  const digits = value.replace(/\D/g, "");

  if (digits.startsWith("55") && digits.length >= 12 && digits.length <= 13) {
    return digits;
  }

  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }

  return null;
}

type UserPasswordDialogProps = {
  userId: string;
  userName: string | null | undefined;
  userEmail: string | null | undefined;
  userWhatsapp: string | null | undefined;
};

export function UserPasswordDialog({
  userId,
  userName,
  userEmail,
  userWhatsapp,
}: UserPasswordDialogProps) {
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [content, setContent] = useState("");

  const displayName = userName || "usuário";
  const email = userEmail || "";
  const hasWhatsapp = Boolean(userWhatsapp?.trim());
  const whatsapp = userWhatsapp?.trim() || "Não informado";

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

      const signInUrl = new URL("/sign-in", window.location.origin).href;

      setContent(
        [
          "Segue os dados de acesso ao Sistema de Atacado",
          "",
          signInUrl,
          "",
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
    const copied = await copyToClipboard(content);

    if (copied) {
      toast.success("Conteúdo copiado para a área de transferência");
    } else {
      toast.error("Falha ao copiar conteúdo");
    }
  };

  const handleWhatsApp = () => {
    if (!content || !userWhatsapp) return;

    const normalizedPhone = normalizeBrazilianPhone(userWhatsapp);

    if (!normalizedPhone) {
      toast.error("O número de WhatsApp do usuário é inválido");
      return;
    }

    const whatsappUrl = `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(content)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
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
              <span className="mt-1 block">
                WhatsApp: <strong>{whatsapp}</strong>
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Textarea
              readOnly
              rows={6}
              value={content}
              placeholder="Clique em 'Gerar Senha' para criar uma nova senha"
              className="resize-none"
            />
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <DialogClose asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                Fechar
              </Button>
            </DialogClose>
            <div className="grid w-full gap-2 sm:flex sm:w-auto">
              {hasWhatsapp && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleWhatsApp}
                  disabled={!content}
                  className="w-full border-[#25D366] bg-[#25D366] text-[#062e14] hover:border-[#20bd5a] hover:bg-[#20bd5a] hover:text-[#062e14] sm:w-auto"
                >
                  <MessageCircle className="mr-1 size-4" />
                  WhatsApp
                </Button>
              )}
              <Button
                type="button"
                variant="secondary"
                onClick={handleCopy}
                disabled={!content}
                className="w-full sm:w-auto"
              >
                <Copy className="mr-1 size-4" />
                Copiar
              </Button>
              <Button
                type="button"
                onClick={handleGeneratePassword}
                disabled={isGenerating}
                className="w-full sm:w-auto"
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
