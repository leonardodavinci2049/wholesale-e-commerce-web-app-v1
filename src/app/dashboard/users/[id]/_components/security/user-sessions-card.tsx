"use client";

import { Monitor, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { UAParser } from "ua-parser-js";
import { LoadingSwap } from "@/components/auth/loading-swap";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Session } from "@/database/shared/auth/auth.types";
import { revokeUserSession } from "../../_actions/session-actions";

interface UserSessionsCardProps {
  sessions: Session[];
}

export function UserSessionsCard({ sessions }: UserSessionsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sessões Ativas</CardTitle>
        <CardDescription>
          Gerencie as sessões ativas deste usuário. Você pode revogar o acesso
          de dispositivos desconhecidos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sessions.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            Nenhuma sessão ativa encontrada.
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <SessionItem key={session.id} session={session} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SessionItem({ session }: { session: Session }) {
  const [isRevoking, setIsRevoking] = useState(false);
  const router = useRouter();
  const userAgentInfo = session.userAgent
    ? new UAParser(session.userAgent).getResult()
    : null;

  async function handleRevoke() {
    setIsRevoking(true);
    try {
      const result = await revokeUserSession(session.id);
      if (result.success) {
        toast.success("Sessão revogada com sucesso");
        router.refresh();
      } else {
        toast.error("Erro ao revogar sessão");
      }
    } catch {
      toast.error("Erro desconhecido ao revogar sessão");
    } finally {
      setIsRevoking(false);
    }
  }

  function getBrowserInformation() {
    if (userAgentInfo == null) return "Dispositivo Desconhecido";
    if (userAgentInfo.browser.name == null && userAgentInfo.os.name == null) {
      return "Dispositivo Desconhecido";
    }

    if (userAgentInfo.browser.name == null) return userAgentInfo.os.name;
    if (userAgentInfo.os.name == null) return userAgentInfo.browser.name;

    return `${userAgentInfo.browser.name}, ${userAgentInfo.os.name}`;
  }

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4">
      <div className="flex items-center gap-3">
        <div className="bg-muted p-2 rounded-full">
          {userAgentInfo?.device.type === "mobile" ? (
            <Smartphone className="h-5 w-5 text-muted-foreground" />
          ) : (
            <Monitor className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <div>
          <div className="font-medium">{getBrowserInformation()}</div>
          <div className="text-xs text-muted-foreground space-y-0.5">
            <p>Criado em: {formatDate(session.createdAt)}</p>
            <p>Atualizado em: {formatDate(session.updatedAt)}</p>
            {session.expiresAt && (
              <p>Expira em: {formatDate(session.expiresAt)}</p>
            )}
            {session.ipAddress && <p>IP: {session.ipAddress}</p>}
          </div>
        </div>
      </div>
      <Button
        variant="destructive"
        size="sm"
        onClick={handleRevoke}
        disabled={isRevoking}
        className="w-full sm:w-auto"
      >
        <LoadingSwap isLoading={isRevoking}>Revogar</LoadingSwap>
      </Button>
    </div>
  );
}
