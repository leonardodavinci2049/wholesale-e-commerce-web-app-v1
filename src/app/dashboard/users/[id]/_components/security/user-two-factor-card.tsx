"use client";

import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface UserTwoFactorCardProps {
  isEnabled: boolean;
}

export function UserTwoFactorCard({ isEnabled }: UserTwoFactorCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 text-left">
        <div className="space-y-1.5">
          <CardTitle>Autenticação de Dois Fatores</CardTitle>
          <CardDescription>
            Defina se a autenticação de dois fatores está ativa para este
            usuário.
          </CardDescription>
        </div>
        <Badge variant={isEnabled ? "default" : "secondary"}>
          {isEnabled ? "Ativado" : "Desativado"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEnabled ? (
          <div className="flex items-center gap-2 p-3 text-sm text-yellow-600 bg-yellow-50 rounded-md dark:bg-yellow-900/10 dark:text-yellow-400">
            <AlertCircle className="h-4 w-4" />
            <p>
              O usuário tem 2FA ativado. Apenas o usuário pode gerenciar seus
              métodos de autenticação.
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2 p-3 text-sm text-muted-foreground bg-muted/50 rounded-md">
            <AlertCircle className="h-4 w-4" />
            <p>
              O 2FA está desativado. O usuário deve ativá-lo em suas
              configurações de perfil.
            </p>
          </div>
        )}

        <Button
          variant={isEnabled ? "destructive" : "outline"}
          disabled
          className="w-full"
        >
          {isEnabled ? "Desativar 2FA" : "Configurar 2FA"}
        </Button>
      </CardContent>
    </Card>
  );
}
