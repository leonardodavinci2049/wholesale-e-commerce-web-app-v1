"use client";

import { BetterAuthActionButton } from "@/components/auth/better-auth-action-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth/auth-client";

export function UserPasswordCard({ email }: { email: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mudar Senha</CardTitle>
        <CardDescription>
          Envie um email para o usuário redefinir a senha de acesso.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BetterAuthActionButton
          variant="outline"
          successMessage="Email de redefinição enviado com sucesso"
          action={() => {
            return authClient.requestPasswordReset({
              email,
              redirectTo: "/reset-password",
            });
          }}
        >
          Enviar Email de Redefinição
        </BetterAuthActionButton>
      </CardContent>
    </Card>
  );
}
