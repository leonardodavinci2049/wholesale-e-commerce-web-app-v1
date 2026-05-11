"use client";

import { ArrowLeft, CheckCircle, Loader2, Mail, RotateCw } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import resendVerificationAction from "./resend-verification-action";

type RegistrationSuccessContentProps = {
  email?: string;
  reason?: "email-not-verified";
};

const initialResendState = null;

export default function RegistrationSuccessContent({
  email,
  reason,
}: RegistrationSuccessContentProps) {
  const [resendState, resendFormAction, isResending] = useActionState(
    resendVerificationAction,
    initialResendState,
  );

  useEffect(() => {
    if (!resendState?.message) {
      return;
    }

    if (resendState.success) {
      toast.success(resendState.message);
      return;
    }

    toast.error(resendState.message);
  }, [resendState]);

  return (
    <div className="bg-muted/50 flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-green-700 dark:text-green-400">
              Verifique seu email
            </CardTitle>
            <CardDescription className="text-base">
              Enviamos um link de verificação para o email informado no
              cadastro.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {reason === "email-not-verified" && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-center dark:border-amber-900/40 dark:bg-amber-950/20">
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                Email ainda não verificado. Confirme seu email para continuar.
              </p>
            </div>
          )}

          {email && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-center dark:border-green-900/40 dark:bg-green-950/20">
              <p className="text-sm text-green-800 dark:text-green-200">
                Email cadastrado
              </p>
              <p className="mt-1 break-all text-sm font-semibold text-green-900 dark:text-green-100">
                {email}
              </p>
            </div>
          )}

          {/* Passo 1: Abrir a caixa de entrada */}
          <div className="flex items-start space-x-3 rounded-lg border bg-amber-50 p-4 dark:bg-amber-950/20">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
              1
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                Acesse sua caixa de entrada
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Procure pela mensagem de verificação enviada logo após o seu
                cadastro.
              </p>
            </div>
          </div>

          {/* Passo 2: Confirmar o email */}
          <div className="flex items-start space-x-3 rounded-lg border bg-blue-50 p-4 dark:bg-blue-950/20">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              2
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Clique no link de verificação
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Ao confirmar seu email pelo link recebido, sua conta estará
                pronta para acessar o sistema.
              </p>
            </div>
          </div>

          {/* Informação adicional */}
          <div className="flex items-start space-x-3 rounded-lg border bg-gray-50 p-4 dark:bg-gray-950/20">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-gray-600 dark:text-gray-400" />
            <div className="space-y-1">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Se não encontrar o email, confira a pasta de spam ou lixo
                eletrônico.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-center">
            <p className="text-muted-foreground text-sm">
              Depois de verificar seu email, volte para a tela de login para
              entrar na plataforma.
            </p>

            {email && (
              <form action={resendFormAction} className="space-y-3">
                <input type="hidden" name="email" value={email} />
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full"
                  disabled={isResending}
                >
                  {isResending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Reenviando email...
                    </>
                  ) : (
                    <>
                      <RotateCw className="mr-2 h-4 w-4" />
                      Reenviar email de verificação
                    </>
                  )}
                </Button>
              </form>
            )}

            <Button asChild className="w-full">
              <Link href="/sign-in">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para o login
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
