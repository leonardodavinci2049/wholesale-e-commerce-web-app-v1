import { BadgeCheck, Calendar, Clock3, User } from "lucide-react";
import type { ElementType, ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { UICustomerDetail } from "@/services/api-main/customer-general/transformers/transformers";

interface CustomerDetailHeaderProps {
  customer: UICustomerDetail;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function formatDate(date: string | null): string {
  if (!date) return "Não informado";
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return "Data inválida";
  }
}

function SectionCard({
  icon: Icon,
  title,
  children,
  className,
}: {
  icon: ElementType;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/70 bg-background/75 p-4 transition-all duration-200 hover:border-border hover:shadow-sm dark:bg-white/[0.03] dark:hover:bg-white/[0.05]",
        className,
      )}
    >
      <div className="mb-4 flex items-center gap-2 border-b border-border/50 pb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        <Icon className="h-4 w-4" />
        {title}
      </div>
      {children}
    </div>
  );
}

export function CustomerDetailHeader({ customer }: CustomerDetailHeaderProps) {
  const isPessoaFisica = customer.personTypeId === 1;
  const personType = isPessoaFisica ? "Pessoa Física" : "Pessoa Jurídica";
  const customerType =
    customer.customerTypeId === 1 ? "CLIENTE ATACADO" : "CLIENTE VAREJO";

  return (
    <SectionCard icon={User} title="Informações do Cliente">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 flex-col items-center gap-4 sm:flex-row sm:items-start">
          <Avatar className="h-20 w-20 shrink-0 rounded-2xl ring-4 ring-primary/10 md:h-20 md:w-20">
            <AvatarImage
              src={customer.imagePath || "/avatars/customer.png"}
              alt={customer.name}
            />
            <AvatarFallback className="rounded-2xl bg-primary/10 text-lg font-semibold text-primary">
              {getInitials(customer.name)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 space-y-2.5 text-center sm:text-left">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground/70">
                ID #{customer.id}
              </p>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                {customer.name}
              </h1>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <Badge
                variant="outline"
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 text-xs font-medium",
                  isPessoaFisica
                    ? "border-violet-500/30 bg-violet-500/5 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400"
                    : "border-amber-500/30 bg-amber-500/5 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
                )}
              >
                <BadgeCheck className="h-3 w-3" />
                {personType}
              </Badge>

              <Badge
                variant="outline"
                className="rounded-full border-primary/30 bg-primary/5 px-3 text-xs font-medium text-primary"
              >
                <User className="mr-1 h-3 w-3" />
                {customerType}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex w-full justify-center gap-3 lg:w-auto lg:justify-start">
          <div className="rounded-xl border border-border/70 bg-muted/30 px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/70">
              Cliente desde
            </p>
            <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-foreground">
              <Clock3 className="h-3.5 w-3.5 text-muted-foreground" />
              {formatDate(customer.createdAt)}
            </p>
          </div>
          <div className="rounded-xl border border-primary/15 bg-primary/5 px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary/80">
              Última compra
            </p>
            <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-foreground">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              {formatDate(customer.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
