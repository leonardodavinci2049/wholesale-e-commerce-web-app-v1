import {
  BadgeCheck,
  Briefcase,
  Building2,
  Calendar,
  Clock3,
  ExternalLink,
  FileText,
  Hash,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Shield,
  User,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type {
  UICustomerDetail,
  UISellerInfo,
} from "@/services/api-main/customer-general/transformers/transformers";
import { CustomerProfileAddressSection } from "./customer-profile-address-section";
import { CustomerSellerCard } from "./customer-seller-card";
import { ProfileInlineField } from "./profile-inline-field";

interface CustomerDetailSectionsProps {
  customer: UICustomerDetail;
  seller?: UISellerInfo | null;
}

function hasValue(value: string | number | null | undefined): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string")
    return value.trim() !== "" && value.trim() !== "0";
  return value !== 0;
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

function formatCpf(cpf: string): string {
  if (!cpf || cpf.length !== 11) return cpf || "Não informado";
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formatCnpj(cnpj: string): string {
  if (!cnpj || cnpj.length !== 14) return cnpj || "Não informado";
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
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

function InfoField({
  icon: Icon,
  label,
  value,
  mono = false,
  className,
  colorScheme = "primary",
}: {
  icon?: React.ElementType;
  label: string;
  value: string;
  mono?: boolean;
  className?: string;
  colorScheme?: "primary" | "emerald" | "sky";
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3.5 rounded-2xl border border-border/60 bg-background/60 p-4 transition-all duration-300 hover:border-primary/20 hover:bg-muted/20 dark:bg-card/25 dark:hover:bg-white/[0.01] shadow-2xs",
        className,
      )}
    >
      {Icon && (
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
            colorScheme === "primary" && "bg-primary/10 text-primary",
            colorScheme === "emerald" && "bg-emerald-500/10 text-emerald-500",
            colorScheme === "sky" && "bg-sky-500/10 text-sky-500",
          )}
        >
          <Icon className="h-4.5 w-4.5" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/85">
          {label}
        </p>
        <p
          className={cn(
            "text-sm font-semibold mt-0.5 text-foreground truncate",
            mono && "font-mono tracking-wide",
            !hasValue(value) && "italic font-normal text-muted-foreground/60",
          )}
        >
          {hasValue(value) ? value : "Não informado"}
        </p>
      </div>
    </div>
  );
}

function EditableInfoField({
  icon: Icon,
  label,
  customerId,
  field,
  value,
  displayValue,
  emptyText,
  className,
  colorScheme = "primary",
}: {
  icon?: React.ElementType;
  label: string;
  customerId: number;
  field:
    | "customerName"
    | "phone"
    | "whatsapp"
    | "email"
    | "companyName"
    | "tradeName"
    | "birthDate"
    | "sellerId";
  value: string;
  displayValue?: string;
  emptyText?: string;
  className?: string;
  colorScheme?: "primary" | "emerald" | "sky";
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3.5 rounded-2xl border border-border/60 bg-background/60 p-4 transition-all duration-300 hover:border-primary/20 hover:bg-muted/20 dark:bg-card/25 dark:hover:bg-white/[0.01] shadow-2xs",
        className,
      )}
    >
      {Icon && (
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
            colorScheme === "primary" && "bg-primary/10 text-primary",
            colorScheme === "emerald" && "bg-emerald-500/10 text-emerald-500",
            colorScheme === "sky" && "bg-sky-500/10 text-sky-500",
          )}
        >
          <Icon className="h-4.5 w-4.5" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/85">
          {label}
        </p>
        <ProfileInlineField
          customerId={customerId}
          field={field}
          value={value}
          displayValue={displayValue}
          emptyText={emptyText}
        />
      </div>
    </div>
  );
}

export function CustomerDetailSections({
  customer,
  seller,
}: CustomerDetailSectionsProps) {
  const isPessoaFisica = customer.personTypeId === 1;
  const isPessoaJuridica = customer.personTypeId === 2;
  const isAtacado = customer.customerTypeId === 1;

  // Pre-filled greetings for direct contact actions
  const emailMailto = customer.email ? `mailto:${customer.email}` : "#";
  const phoneTel = customer.phone ? `tel:${customer.phone}` : "#";
  const whatsappLink = customer.whatsapp
    ? `https://wa.me/55${customer.whatsapp.replace(/\D/g, "")}`
    : "#";

  return (
    <div className="grid grid-cols-1 gap-8 items-start lg:grid-cols-12">
      {/* Main Area: first on mobile and left on desktop */}
      <div className="space-y-6 lg:col-span-8">
        {/* Animated Tabs Navigation */}
        <Tabs defaultValue="cadastro" className="w-full">
          <TabsList className="mb-6 flex w-full flex-wrap justify-start gap-1.5 rounded-2xl bg-muted/40 p-1.5 backdrop-blur-xs border border-border/50 dark:bg-white/[0.02]">
            <TabsTrigger
              value="cadastro"
              className="flex-1 sm:flex-initial gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
            >
              <User className="h-4 w-4 shrink-0" />
              Dados Cadastrais
            </TabsTrigger>
            <TabsTrigger
              value="contato"
              className="flex-1 sm:flex-initial gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
            >
              <Phone className="h-4 w-4 shrink-0" />
              Contatos
            </TabsTrigger>
            <TabsTrigger
              value="endereco"
              className="flex-1 sm:flex-initial gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
            >
              <MapPin className="h-4 w-4 shrink-0" />
              Endereço
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: DADOS CADASTRAIS */}
          <TabsContent value="cadastro" className="space-y-6 mt-0">
            {/* Pessoa Física Details */}
            {isPessoaFisica && (
              <div className="rounded-3xl border border-border/80 bg-linear-to-b from-card/60 to-card/25 p-5 shadow-xs dark:from-card/30 dark:to-card/5">
                <div className="mb-4 flex items-center gap-2 border-b border-border/40 pb-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="h-4 w-4" />
                  </div>
                  <h3 className="text-xs font-extrabold uppercase tracking-[0.15em] text-primary">
                    Dados de Pessoa Física
                  </h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoField
                    icon={Hash}
                    label="CPF"
                    value={formatCpf(customer.cpf)}
                    mono
                    colorScheme="primary"
                  />
                  <EditableInfoField
                    icon={Calendar}
                    label="Data de Nascimento"
                    customerId={customer.id}
                    field="birthDate"
                    value={customer.birthDate || ""}
                    displayValue={formatDate(customer.birthDate || null)}
                    emptyText="Não informado"
                    colorScheme="primary"
                  />
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-xl bg-primary/5 px-3 py-2 text-xs font-semibold text-primary dark:bg-primary/10">
                  <BadgeCheck className="h-4 w-4 shrink-0" />
                  Sua conta de Pessoa Física está verificada e ativa.
                </div>
              </div>
            )}

            {isPessoaJuridica && (
              <div className="rounded-3xl border border-border/80 bg-linear-to-b from-card/60 to-card/25 p-5 shadow-xs dark:from-card/30 dark:to-card/5">
                <div className="mb-4 flex items-center gap-2 border-b border-border/40 pb-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <h3 className="text-xs font-extrabold uppercase tracking-[0.15em] text-primary">
                    Dados Corporativos (Pessoa Jurídica)
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <EditableInfoField
                      icon={Building2}
                      label="Razão Social"
                      customerId={customer.id}
                      field="companyName"
                      value={customer.companyName}
                      colorScheme="primary"
                    />
                    <EditableInfoField
                      icon={User}
                      label="Nome Fantasia"
                      customerId={customer.id}
                      field="tradeName"
                      value={customer.tradeName || ""}
                      colorScheme="primary"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <InfoField
                      icon={Hash}
                      label="CNPJ"
                      value={formatCnpj(customer.cnpj || "")}
                      mono
                      colorScheme="primary"
                    />
                    <InfoField
                      icon={FileText}
                      label="Inscrição Estadual"
                      value={
                        hasValue(customer.stateRegistration)
                          ? customer.stateRegistration || "Isento"
                          : "Isento / Não informado"
                      }
                      mono
                      colorScheme="primary"
                    />
                    <InfoField
                      icon={FileText}
                      label="Inscrição Municipal"
                      value={
                        hasValue(customer.municipalRegistration)
                          ? customer.municipalRegistration || "Não informado"
                          : "Não informado"
                      }
                      mono
                      colorScheme="primary"
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-xl bg-primary/5 px-3 py-2 text-xs font-semibold text-primary dark:bg-primary/10">
                  <BadgeCheck className="h-4 w-4 shrink-0" />
                  Sua conta de Pessoa Jurídica está verificada e ativa.
                </div>
              </div>
            )}

            {/* General Metadata Box */}
            <div className="rounded-3xl border border-border/80 bg-linear-to-b from-card/60 to-card/25 p-5 shadow-xs dark:from-card/30 dark:to-card/5">
              <div className="mb-4 flex items-center gap-2 border-b border-border/40 pb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Clock3 className="h-4 w-4" />
                </div>
                <h3 className="text-xs font-extrabold uppercase tracking-[0.15em] text-primary">
                  Informações da Conta
                </h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <InfoField
                  icon={Calendar}
                  label="Data de Cadastro"
                  value={formatDate(customer.createdAt)}
                />
                <EditableInfoField
                  icon={User}
                  label="Vendedor Vinculado ID"
                  customerId={customer.id}
                  field="sellerId"
                  value={String(customer.sellerId)}
                  colorScheme="primary"
                />
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: CONTATO E COMUNICAÇÃO */}
          <TabsContent value="contato" className="space-y-6 mt-0">
            <div className="rounded-3xl border border-border/80 bg-linear-to-b from-card/60 to-card/25 p-5 shadow-xs dark:from-card/30 dark:to-card/5">
              <div className="mb-4 flex items-center gap-2 border-b border-border/40 pb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                  <Phone className="h-4 w-4" />
                </div>
                <h3 className="text-xs font-extrabold uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-400">
                  Canais de Comunicação
                </h3>
              </div>

              {/* Grid of details & click actions */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="group/item relative space-y-2">
                  <EditableInfoField
                    icon={Phone}
                    label="Telefone Comercial"
                    customerId={customer.id}
                    field="phone"
                    value={customer.phone}
                    displayValue={formatPhone(customer.phone)}
                    colorScheme="emerald"
                  />
                  {customer.phone && (
                    <a
                      href={phoneTel}
                      className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-muted-foreground opacity-0 transition-all hover:bg-emerald-500/20 hover:text-emerald-600 group-hover/item:opacity-100 dark:bg-white/[0.03]"
                      title="Ligar"
                    >
                      <Phone className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>

                <div className="group/item relative space-y-2">
                  <EditableInfoField
                    icon={MessageCircle}
                    label="WhatsApp Principal"
                    customerId={customer.id}
                    field="whatsapp"
                    value={customer.whatsapp || ""}
                    displayValue={
                      hasValue(customer.whatsapp)
                        ? formatPhone(customer.whatsapp)
                        : "Não informado"
                    }
                    colorScheme="emerald"
                  />
                  {hasValue(customer.whatsapp) && (
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-muted-foreground opacity-0 transition-all hover:bg-emerald-500/20 hover:text-emerald-600 group-hover/item:opacity-100 dark:bg-white/[0.03]"
                      title="Chamar WhatsApp"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>

                <div className="group/item relative space-y-2">
                  <EditableInfoField
                    icon={Mail}
                    label="E-mail de Notificações"
                    customerId={customer.id}
                    field="email"
                    value={customer.email}
                    colorScheme="emerald"
                  />
                  {customer.email && (
                    <a
                      href={emailMailto}
                      className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-muted-foreground opacity-0 transition-all hover:bg-emerald-500/20 hover:text-emerald-600 group-hover/item:opacity-100 dark:bg-white/[0.03]"
                      title="Enviar E-mail"
                    >
                      <Mail className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: ENDEREÇO COMERCIAL */}
          <TabsContent value="endereco" className="mt-0">
            <div className="rounded-3xl border border-border/80 bg-linear-to-b from-card/60 to-card/25 p-5 shadow-xs dark:from-card/30 dark:to-card/5">
              <CustomerProfileAddressSection customer={customer} />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Secondary Area: below on mobile and right on desktop */}
      <div className="space-y-6 lg:col-span-4">
        {/* Account Quick Stats Box */}
        <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-linear-to-b from-card/70 to-card/35 p-6 backdrop-blur-md dark:from-card/40 dark:to-card/10">
          <h4 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-foreground/80 border-b border-border/40 pb-3">
            <Briefcase className="h-4 w-4 text-primary" />
            Resumo do Perfil
          </h4>

          <ul className="mt-4 space-y-3.5 text-xs">
            <li className="flex items-center justify-between border-b border-border/30 pb-2">
              <span className="text-muted-foreground font-medium">
                Situação Cadastral
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                Ativo
              </span>
            </li>
            <li className="flex items-center justify-between border-b border-border/30 pb-2">
              <span className="text-muted-foreground font-medium">
                Categoria
              </span>
              <span className="font-bold text-foreground">
                {isAtacado ? "Atacado VIP" : "Varejo Convencional"}
              </span>
            </li>
            <li className="flex items-center justify-between border-b border-border/30 pb-2">
              <span className="text-muted-foreground font-medium">
                Tipo de Conta
              </span>
              <span className="font-bold text-foreground">
                {isPessoaFisica ? "Física (CPF)" : "Jurídica (CNPJ)"}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium">
                Registro
              </span>
              <span className="font-mono text-muted-foreground font-bold">
                {formatDate(customer.createdAt)}
              </span>
            </li>
          </ul>
        </div>

        {/* Concierge Seller VIP widget */}
        {seller ? (
          <CustomerSellerCard seller={seller} />
        ) : (
          <div className="relative overflow-hidden rounded-3xl border border-dashed border-border/80 bg-muted/20 p-6 text-center backdrop-blur-xs">
            <Shield className="mx-auto h-8 w-8 text-muted-foreground/60" />
            <h4 className="mt-3 text-sm font-bold text-foreground">
              Suporte Comercial
            </h4>
            <p className="mt-1 text-xs text-muted-foreground">
              Nenhum vendedor exclusivo associado a esta conta comercial.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
