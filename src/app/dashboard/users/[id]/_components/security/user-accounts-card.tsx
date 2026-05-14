"use client";

import { Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { LoadingSwap } from "@/components/auth/loading-swap";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Account } from "@/database/shared/auth/auth.types";
import {
  SUPPORTED_OAUTH_PROVIDER_DETAILS,
  type SupportedOAuthProvider,
} from "@/lib/auth/o-auth-providers";
import { unlinkUserAccount } from "../../_actions/account-actions";

interface UserAccountsCardProps {
  accounts: Account[];
}

export function UserAccountsCard({ accounts }: UserAccountsCardProps) {
  // Filter out credential accounts (password) as they are handled separately
  const linkedAccounts = accounts.filter((a) => a.providerId !== "credential");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contas Vinculadas</CardTitle>
        <CardDescription>
          Visualize e gerencie as contas de provedores externos vinculadas a
          este usuário.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {linkedAccounts.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            Nenhuma conta vinculada encontrada.
          </div>
        ) : (
          <div className="space-y-3">
            {linkedAccounts.map((account) => (
              <AccountItem key={account.id} account={account} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AccountItem({ account }: { account: Account }) {
  const [isUnlinking, setIsUnlinking] = useState(false);
  const router = useRouter();

  const providerDetails = SUPPORTED_OAUTH_PROVIDER_DETAILS[
    account.providerId as SupportedOAuthProvider
  ] ?? {
    name: account.providerId,
    Icon: Shield,
  };

  const ProviderIcon = providerDetails.Icon;

  async function handleUnlink() {
    setIsUnlinking(true);
    try {
      const result = await unlinkUserAccount(account.id);
      if (result.success) {
        toast.success("Conta desvinculada com sucesso");
        router.refresh();
      } else {
        toast.error("Erro ao desvincular conta");
      }
    } catch {
      toast.error("Erro desconhecido ao desvincular conta");
    } finally {
      setIsUnlinking(false);
    }
  }

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "medium",
    }).format(new Date(date));
  }

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="bg-muted p-2 rounded-full">
          <ProviderIcon className="h-5 w-5" />
        </div>
        <div>
          <p className="font-medium">{providerDetails.name}</p>
          <p className="text-sm text-muted-foreground">
            Vinculado em: {formatDate(account.createdAt)}
          </p>
        </div>
      </div>
      <Button
        variant="destructive"
        size="sm"
        onClick={handleUnlink}
        disabled={isUnlinking}
      >
        <LoadingSwap isLoading={isUnlinking}>Desvincular</LoadingSwap>
      </Button>
    </div>
  );
}
