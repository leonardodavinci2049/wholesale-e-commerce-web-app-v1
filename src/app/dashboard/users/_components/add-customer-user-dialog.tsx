"use client";

import { Loader2, Search, UserPlus } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

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
import type { UICustomerListItem } from "@/services/api-main/customer-general/transformers/transformers";
import {
  addCustomerAsUserAction,
  searchCustomersAction,
} from "../_forms/add-customer-user";

export function AddCustomerUserDialog() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState<UICustomerListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [, startTransition] = useTransition();

  const debouncedSearch = useDebounce(search, 350);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setIsLoading(true);
    searchCustomersAction(debouncedSearch)
      .then((res) => {
        if (cancelled) return;
        if (res.success) {
          setCustomers(res.customers);
        } else {
          setCustomers([]);
          toast.error(res.message ?? "Falha ao carregar clientes");
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
      setCustomers([]);
      setPendingId(null);
    }
  }, [open]);

  function handleAdd(customer: UICustomerListItem) {
    setPendingId(customer.customerId);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("customerId", String(customer.customerId));
      const result = await addCustomerAsUserAction(
        { success: false, message: "" },
        formData,
      );
      setPendingId(null);
      if (result.success) {
        toast.success(result.message);
        setOpen(false);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserPlus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Adicionar Usuário</span>
          <span className="sm:hidden">Adicionar</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Adicionar Usuário a partir de Cliente</DialogTitle>
          <DialogDescription>
            Pesquise e selecione um cliente para criar um usuário do sistema.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por nome do cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              autoFocus
            />
          </div>

          <ScrollArea className="h-[400px] rounded-md border">
            {isLoading ? (
              <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : customers.length === 0 ? (
              <div className="flex h-[400px] items-center justify-center text-sm text-muted-foreground">
                Nenhum cliente encontrado
              </div>
            ) : (
              <ul className="divide-y">
                {customers.map((customer) => (
                  <li
                    key={customer.customerId}
                    className="flex items-center justify-between gap-4 p-3 hover:bg-muted/50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{customer.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {customer.email || "Sem e-mail"}
                        {customer.cpf
                          ? ` • CPF: ${customer.cpf}`
                          : customer.cnpj
                            ? ` • CNPJ: ${customer.cnpj}`
                            : ""}
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleAdd(customer)}
                      disabled={pendingId !== null}
                    >
                      {pendingId === customer.customerId ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Adicionar"
                      )}
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
