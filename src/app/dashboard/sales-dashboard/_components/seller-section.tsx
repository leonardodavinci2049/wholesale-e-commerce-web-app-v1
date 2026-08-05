import {
  BadgeCheck,
  Hash,
  Mail,
  MessageCircle,
  Phone,
  UserRound,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import type { UIOrderB2bSeller } from "@/services/api-main/order-b2b";

interface SellerSectionProps {
  seller: UIOrderB2bSeller | null;
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

function formatPhone(phone: string): string {
  if (!phone) return "";

  const digits = phone.replace(/\D/g, "");

  if (digits.length === 11) {
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }

  if (digits.length === 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }

  return phone;
}

function ContactField({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-border/70 bg-background/75 p-4 dark:bg-white/3">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
        <Icon className="h-3.5 w-3.5 text-primary" />
        {label}
      </div>
      <p className="mt-2 break-words text-sm font-medium text-foreground">
        {value || (
          <span className="italic text-muted-foreground/60">Não informado</span>
        )}
      </p>
    </div>
  );
}

export function SellerSection({ seller }: SellerSectionProps) {
  return (
    <Card className="overflow-hidden rounded-[28px] border-border/70 bg-linear-to-b from-card via-card to-muted/40 p-0 shadow-xl shadow-black/10 dark:shadow-black/30">
      {seller ? (
        <div className="space-y-4 p-3 md:p-4">
          <div className="rounded-2xl border border-border/70 bg-background/75 p-4 dark:bg-white/3 md:p-5">
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
              <Avatar className="h-20 w-20 shrink-0 rounded-2xl ring-4 ring-primary/10">
                <AvatarImage
                  src={
                    seller.sellerImage || "/images/user/default-user-image.png"
                  }
                  alt={seller.sellerName}
                />
                <AvatarFallback className="rounded-2xl bg-primary/10 text-lg font-semibold text-primary">
                  {getInitials(seller.sellerName)}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80 sm:justify-start">
                  <Hash className="h-3 w-3" />
                  Vendedor {seller.sellerId}
                </div>
                <h3 className="break-words text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                  {seller.sellerName}
                </h3>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Responsável pelo pedido
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <ContactField
              icon={Phone}
              label="Telefone"
              value={formatPhone(seller.sellerPhone)}
            />
            <ContactField
              icon={MessageCircle}
              label="WhatsApp"
              value={formatPhone(seller.sellerWhatsapp)}
            />
            <ContactField
              icon={Mail}
              label="E-mail"
              value={seller.sellerEmail}
            />
          </div>
        </div>
      ) : (
        <div className="px-5 py-8 md:px-6 md:py-10">
          <div className="rounded-3xl border border-dashed border-border bg-background/70 p-8 text-center dark:bg-white/4">
            <UserRound className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <p className="mt-3 text-lg font-semibold text-foreground">
              Vendedor não informado
            </p>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
              Este pedido não possui informações de vendedor disponíveis.
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
