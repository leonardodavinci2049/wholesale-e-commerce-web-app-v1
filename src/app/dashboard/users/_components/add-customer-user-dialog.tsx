"use client";

import { Loader2, Search, UserPlus } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  getCustomerUserValidationMessage,
  searchCustomersAction,
} from "../_forms/add-customer-user";

function getCustomerInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function truncateCustomerName(name: string, maxLength = 50) {
  if (name.length <= maxLength) {
    return name;
  }

  return `${name.slice(0, maxLength).trimEnd()}...`;
}

function getCustomerTypeBadgeClassName(customerType: string) {
  return customerType.toUpperCase() === "ATACADO"
    ? "bg-green-100 text-green-800 hover:bg-green-100"
    : "bg-orange-100 text-orange-800 hover:bg-orange-100";
}

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
    const validationMessage = getCustomerUserValidationMessage(customer);

    if (validationMessage) {
      toast.error(validationMessage);
      return;
    }

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
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Adicionar Usuário</span>
          <span className="sm:hidden">Adicionar</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100%-0.75rem)] gap-4 rounded-2xl p-3 sm:max-w-2xl sm:gap-6 sm:rounded-4xl sm:p-6">
        <DialogHeader className="pr-10">
          <DialogTitle>Adicionar Usuário a partir de Cliente</DialogTitle>
          <DialogDescription>
            Pesquise e selecione um cliente para criar um usuário do sistema.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4">
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

          <ScrollArea className="h-[min(400px,calc(100vh-13rem))] rounded-md border">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : customers.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Nenhum cliente encontrado
              </div>
            ) : (
              <ul className="divide-y pr-2 sm:pr-4">
                {customers.map((customer) => (
                  <li
                    key={customer.customerId}
                    className="grid gap-2 p-2 hover:bg-muted/50 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-4 sm:p-3"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <Avatar className="h-10 w-10 shrink-0 sm:h-12 sm:w-12">
                        <AvatarImage
                          src={
                            customer.imagePath ||
                            "/images/user/default-user-image.png"
                          }
                          alt={customer.name}
                        />
                        <AvatarFallback>
                          {getCustomerInitials(customer.name)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1 space-y-1">
                        <p className="wrap-anywhere font-medium leading-snug sm:truncate">
                          {truncateCustomerName(customer.name)}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                          <span className="font-medium">
                            ID: {customer.customerId}
                          </span>
                          <Badge
                            className={getCustomerTypeBadgeClassName(
                              customer.customerType || "",
                            )}
                          >
                            {customer.customerType || "-"}
                          </Badge>
                          <span>{customer.personType || "-"}</span>
                        </div>

                        <p className="truncate text-xs text-muted-foreground">
                          {customer.email || "Sem e-mail"}
                        </p>
                      </div>
                    </div>
                    <Button
                      className="w-full shrink-0 sm:w-auto"
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
