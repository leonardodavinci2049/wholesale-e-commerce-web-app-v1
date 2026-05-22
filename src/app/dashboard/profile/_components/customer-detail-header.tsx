import { BadgeCheck, Calendar, Clock3, Sparkles, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { UICustomerDetail } from "@/services/api-main/customer-general/transformers/transformers";
import { ProfileInlineField } from "./profile-inline-field";

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

export function CustomerDetailHeader({ customer }: CustomerDetailHeaderProps) {
  const isPessoaFisica = customer.personTypeId === 1;
  const personType = isPessoaFisica ? "Pessoa Física" : "Pessoa Jurídica";
  const isAtacado = customer.customerTypeId === 1;
  const customerType = isAtacado ? "CLIENTE ATACADO" : "CLIENTE VAREJO";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border/80 bg-linear-to-b from-background/80 to-background/40 p-6 md:p-8 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-primary/20 hover:shadow-2xl dark:from-card/40 dark:to-card/10",
      )}
    >
      {/* Background ambient light effects (luxury glassmorphism blobs using theme colors) */}
      <div
        className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl pointer-events-none animate-pulse"
        style={{ animationDuration: "6s" }}
      />
      <div
        className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-primary/5 blur-3xl pointer-events-none animate-pulse"
        style={{ animationDuration: "8s" }}
      />

      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {/* Left Side: Avatar and Quick Info */}
        <div className="flex flex-col items-center gap-5 text-center md:flex-row md:text-left">
          {/* Avatar Container with glowing active theme gradient ring */}
          <div className="relative group">
            <div
              className={cn(
                "absolute -inset-0.5 rounded-3xl bg-linear-to-tr opacity-75 blur-xs transition duration-300 group-hover:opacity-100",
                isAtacado
                  ? "from-primary via-accent-foreground/60 to-primary/40"
                  : "from-primary via-primary/60 to-primary/20",
              )}
            />
            <Avatar className="relative h-24 w-24 shrink-0 rounded-3xl ring-4 ring-background md:h-26 md:w-26">
              <AvatarImage
                src={customer.imagePath || "/avatars/customer.png"}
                alt={customer.name}
                className="object-cover"
              />
              <AvatarFallback className="rounded-3xl text-2xl font-bold tracking-wider bg-linear-to-tr from-primary/20 to-primary/5 text-primary">
                {getInitials(customer.name)}
              </AvatarFallback>
            </Avatar>
            {isAtacado && (
              <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg animate-bounce">
                <Sparkles className="h-3 w-3" />
              </span>
            )}
          </div>

          {/* Name and ID and Badges */}
          <div className="space-y-3">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/90 dark:bg-white/3">
                ID #{customer.id}
              </span>
              <ProfileInlineField
                customerId={customer.id}
                field="customerName"
                value={customer.name}
                variant="title"
                className="mt-1"
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <Badge
                variant="outline"
                className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-2xs border-0 bg-primary/10 text-primary"
              >
                <User className="h-3.5 w-3.5" />
                {personType}
              </Badge>

              <Badge
                variant="outline"
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-2xs border-0",
                  isAtacado
                    ? "bg-accent-foreground/15 text-accent-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                <BadgeCheck className="h-3.5 w-3.5" />
                {customerType}
              </Badge>
            </div>
          </div>
        </div>

        {/* Right Side: Key Metadata Cards in Theme Colors */}
        <div className="flex flex-row flex-wrap items-center justify-center gap-3 md:flex-col md:items-end">
          <div className="flex w-full min-w-37.5 items-center gap-3 rounded-2xl border border-border/60 bg-muted/20 p-3 shadow-2xs backdrop-blur-xs transition-all hover:bg-muted/40 sm:w-auto dark:border-white/5 dark:bg-white/2 dark:hover:bg-white/4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Clock3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                Cliente desde
              </p>
              <p className="mt-0.5 text-sm font-bold text-foreground">
                {formatDate(customer.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex w-full min-w-37.5 items-center gap-3 rounded-2xl border border-border/60 bg-muted/20 p-3 shadow-2xs backdrop-blur-xs transition-all hover:bg-muted/40 sm:w-auto dark:border-white/5 dark:bg-white/2 dark:hover:bg-white/4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
                Última compra
              </p>
              <p className="mt-0.5 text-sm font-bold text-foreground">
                {formatDate(customer.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
