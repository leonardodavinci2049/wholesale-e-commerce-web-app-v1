import {
  ExternalLink,
  Mail,
  MessageCircle,
  Phone,
  Sparkles,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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

function getWhatsAppUrl(phone: string, sellerName: string): string {
  const clean = phone.replace(/\D/g, "");
  if (!clean) return "";
  const withCountry = clean.startsWith("55") ? clean : `55${clean}`;
  const text = encodeURIComponent(
    `Olá, ${sellerName}! Estou no portal Mercury e gostaria de tirar uma dúvida sobre minhas compras.`,
  );
  return `https://wa.me/${withCountry}?text=${text}`;
}

export function CustomerSellerCard({ seller }: CustomerSellerCardProps) {
  const whatsappUrl = seller.whatsapp
    ? getWhatsAppUrl(seller.whatsapp, seller.name)
    : null;
  const hasPhone = !!seller.phone;
  const hasEmail = !!seller.email;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-linear-to-b from-card/85 to-card/45 p-6 shadow-md backdrop-blur-md transition-all duration-300 hover:border-primary/20 hover:shadow-xl dark:from-card/50 dark:to-card/20">
      {/* Ambience glow using theme colors */}
      <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-primary/5 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-accent/30 blur-2xl pointer-events-none" />

      {/* Card Header */}
      <div className="relative z-10 mb-6 flex items-center justify-between border-b border-border/50 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <User className="h-4 w-4" />
          </div>
          <h3 className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
            Gerente de Contas
          </h3>
        </div>
        <Badge className="rounded-full bg-primary/10 text-[10px] font-bold text-primary border-0">
          <Sparkles
            className="mr-1 h-3 w-3 animate-spin"
            style={{ animationDuration: "4s" }}
          />
          Suporte VIP
        </Badge>
      </div>

      {/* Card Body */}
      <div className="relative z-10 space-y-6">
        {/* Seller Info Detail Row */}
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute -inset-0.5 rounded-2xl bg-linear-to-tr from-primary/60 to-primary/20 opacity-60 blur-xs transition duration-300 group-hover:opacity-100" />
            <Avatar className="relative h-16 w-16 shrink-0 rounded-2xl ring-2 ring-background">
              <AvatarImage
                src={seller.imagePath || ""}
                alt={seller.name}
                className="object-cover"
              />
              <AvatarFallback className="rounded-2xl bg-primary/10 text-sm font-bold text-primary">
                {getInitials(seller.name)}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="min-w-0 flex-1">
            <span className="inline-block rounded-md bg-muted px-2 py-0.5 text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
              Código #{seller.id}
            </span>
            <h4 className="mt-1 truncate text-lg font-bold text-foreground tracking-tight">
              {seller.name}
            </h4>
            <p className="text-xs text-muted-foreground/80">
              Seu vendedor e consultor comercial
            </p>
          </div>
        </div>

        {/* WhatsApp CTA — theme primary color */}
        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-md transition-all duration-300 hover:opacity-90 hover:shadow-lg active:scale-[0.98]"
          >
            <MessageCircle className="h-5 w-5 transition-transform duration-300 group-hover/btn:scale-110" />
            <span>Falar no WhatsApp</span>
            <ExternalLink className="h-3.5 w-3.5 opacity-60 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
          </a>
        )}

        {/* Contact info grid */}
        <div className="grid gap-3 sm:grid-cols-2">
          {hasPhone && (
            <a
              href={`tel:${seller.phone}`}
              className="group/item flex items-center gap-3 rounded-2xl border border-border/70 bg-background/50 p-3 transition-all hover:border-primary/20 hover:bg-muted/30 dark:bg-background/25"
              title="Ligar para vendedor"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary group-hover/item:bg-primary/10">
                <Phone className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground/80">
                  Ligar no Telefone
                </p>
                <p className="truncate text-xs font-semibold text-foreground mt-0.5">
                  {formatPhone(seller.phone)}
                </p>
              </div>
            </a>
          )}

          {hasEmail && (
            <a
              href={`mailto:${seller.email}`}
              className="group/item flex items-center gap-3 rounded-2xl border border-border/70 bg-background/50 p-3 transition-all hover:border-primary/20 hover:bg-muted/30 dark:bg-background/25"
              title="Enviar e-mail"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary group-hover/item:bg-primary/10">
                <Mail className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground/80">
                  Enviar E-mail
                </p>
                <p className="truncate text-xs font-semibold text-foreground mt-0.5">
                  {seller.email}
                </p>
              </div>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
