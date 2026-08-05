"use client";

import { Check, Loader2, Pencil, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDebounce } from "@/hooks/use-debounce";
import {
  type SellerOption,
  searchSellersAction,
  updateUserSellerAction,
} from "../_actions/seller-actions";

type SellerIdEditorProps = {
  userId: string;
  userName: string;
  personId: number | null;
  sellerId: number | null;
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function SellerIdEditor({
  userId,
  userName,
  personId,
  sellerId,
}: SellerIdEditorProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sellers, setSellers] = useState<SellerOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingSellerId, setPendingSellerId] = useState<number | null>(null);
  const [, startTransition] = useTransition();
  const debouncedSearch = useDebounce(search, 350);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setIsLoading(true);

    searchSellersAction(debouncedSearch)
      .then((result) => {
        if (cancelled) return;

        if (result.success) {
          setSellers(result.sellers);
          return;
        }

        setSellers([]);
        toast.error(result.message);
      })
      .catch(() => {
        if (!cancelled) {
          setSellers([]);
          toast.error("Falha ao carregar vendedores");
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, open]);

  useEffect(() => {
    if (!open) {
      setSearch("");
      setSellers([]);
      setPendingSellerId(null);
    }
  }, [open]);

  function handleSelect(seller: SellerOption) {
    if (seller.id === sellerId) return;

    setPendingSellerId(seller.id);
    startTransition(async () => {
      const result = await updateUserSellerAction({
        userId,
        sellerId: seller.id,
      });
      setPendingSellerId(null);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setOpen(false);
      router.refresh();
    });
  }

  const hasCustomer = personId != null && personId > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-1">
        <span>{sellerId != null ? `#${sellerId}` : "—"}</span>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            disabled={!hasCustomer}
            title={
              hasCustomer
                ? `Alterar vendedor padrão de ${userName}`
                : "Usuário sem ID de cliente"
            }
            aria-label={`Alterar vendedor padrão de ${userName}`}
          >
            <Pencil />
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent className="max-w-[calc(100%-0.75rem)] gap-4 rounded-2xl p-3 sm:max-w-xl sm:gap-6 sm:rounded-4xl sm:p-6">
        <DialogHeader className="pr-10">
          <DialogTitle>Selecionar vendedor padrão</DialogTitle>
          <DialogDescription>
            Escolha o vendedor padrão de {userName} (cliente #{personId}).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Pesquisar pelo nome do vendedor..."
              className="pl-9"
              autoFocus
            />
          </div>

          <ScrollArea className="h-[min(400px,calc(100vh-13rem))] rounded-md border">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="sr-only">Carregando vendedores</span>
              </div>
            ) : sellers.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Nenhum vendedor encontrado
              </div>
            ) : (
              <ul className="divide-y pr-2 sm:pr-4">
                {sellers.map((seller) => {
                  const isCurrent = seller.id === sellerId;
                  const isPending = pendingSellerId === seller.id;

                  return (
                    <li key={seller.id}>
                      <button
                        type="button"
                        className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={() => handleSelect(seller)}
                        disabled={pendingSellerId !== null || isCurrent}
                        aria-label={`Selecionar vendedor ${seller.name}, ID ${seller.id}`}
                      >
                        <Avatar className="h-11 w-11">
                          <AvatarImage
                            src={
                              seller.imagePath ||
                              "/images/user/default-user-image.png"
                            }
                            alt={seller.name}
                          />
                          <AvatarFallback>
                            {getInitials(seller.name)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{seller.name}</p>
                          <p className="text-xs text-muted-foreground">
                            ID: {seller.id}
                          </p>
                        </div>

                        {isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : isCurrent ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
