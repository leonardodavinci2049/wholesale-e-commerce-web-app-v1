import { Mail, MessageCircle, Phone, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { UISellerInfo } from "@/services/api-main/customer-general/transformers/transformers";

interface CustomerSellerCardProps {
  seller: UISellerInfo;
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
  if (!phone) return "Não informado";
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11) {
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
  if (digits.length === 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  return phone;
}

export function CustomerSellerCard({ seller }: CustomerSellerCardProps) {
  return (
    <Card className="rounded-2xl border-border/70 bg-background/75 p-5 shadow-sm dark:bg-white/[0.03]">
      <div className="mb-10 flex items-center gap-2 border-b border-border/50 pb-3">
        <User className="h-4 w-4 text-primary" />
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Vendedor Associado
        </h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 shrink-0 rounded-2xl ring-2 ring-primary/10">
            <AvatarImage src={seller.imagePath} alt={seller.name} />
            <AvatarFallback className="rounded-2xl bg-primary/10 text-sm font-semibold text-primary">
              {getInitials(seller.name)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="rounded-full border-primary/30 bg-primary/5 text-[10px] font-medium text-primary"
              >
                ID #{seller.id}
              </Badge>
            </div>
            <h4 className="mt-2 truncate text-base font-semibold text-foreground">
              {seller.name}
            </h4>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-border/70 bg-background/70 px-3 py-3 dark:bg-background/40">
            <Phone className="h-4 w-4 shrink-0 text-foreground" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                Telefone
              </p>
              <p className="truncate text-sm text-foreground">
                {formatPhone(seller.phone)}
              </p>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-border/70 bg-background/70 px-3 py-3 dark:bg-background/40">
            <MessageCircle className="h-4 w-4 shrink-0 text-foreground" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                WhatsApp
              </p>
              <p className="truncate text-sm text-foreground">
                {formatPhone(seller.whatsapp)}
              </p>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-border/70 bg-background/70 px-3 py-3 dark:bg-background/40 sm:col-span-2">
            <Mail className="h-4 w-4 shrink-0 text-foreground" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                E-mail
              </p>
              <p className="truncate text-sm text-foreground">{seller.email}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
