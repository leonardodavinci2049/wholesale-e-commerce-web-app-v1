"use client";

import {
  Check,
  Globe,
  Hash,
  Loader2,
  type LucideIcon,
  MapPin,
  Navigation,
  PencilLine,
  Search,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  fetchAddressByCep,
  formatCep as formatCepValue,
  validateCep,
} from "@/services/api-cep/cep-service";
import type { UICustomerDetail } from "@/services/api-main/customer-general/transformers/transformers";
import { updateProfileCustomerAddressAction } from "../actions/update-profile-customer-address-action";

type AddressFormValues = {
  zipCode: string;
  address: string;
  addressNumber: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  municipalityCode: string;
  stateCode: string;
};

const ADDRESS_FIELDS: Array<{
  key: keyof AddressFormValues;
  label: string;
  icon?: LucideIcon;
  placeholder: string;
  mono?: boolean;
  inputMode?: React.ComponentProps<typeof Input>["inputMode"];
}> = [
  {
    key: "address",
    label: "Endereço",
    icon: MapPin,
    placeholder: "Rua, avenida ou logradouro",
  },
  {
    key: "addressNumber",
    label: "Número",
    icon: Hash,
    placeholder: "Número do endereço",
    mono: true,
  },
  {
    key: "complement",
    label: "Complemento",
    placeholder: "Apto, bloco, referência",
  },
  {
    key: "neighborhood",
    label: "Bairro",
    placeholder: "Bairro",
  },
  {
    key: "city",
    label: "Cidade",
    placeholder: "Cidade",
  },
  {
    key: "state",
    label: "UF",
    placeholder: "UF",
    mono: true,
  },
  {
    key: "municipalityCode",
    label: "Cód. Município",
    placeholder: "Código IBGE do município",
    mono: true,
    inputMode: "numeric",
  },
  {
    key: "stateCode",
    label: "Cód. UF",
    placeholder: "Código da UF",
    mono: true,
    inputMode: "numeric",
  },
];

function hasValue(value: string | number | null | undefined): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") {
    return value.trim() !== "" && value.trim() !== "0";
  }
  return value !== 0;
}

function formatCep(cep: string): string {
  const digits = cep.replace(/\D/g, "");
  if (digits?.length !== 8) return cep || "Não informado";
  return digits.replace(/(\d{5})(\d{3})/, "$1-$2");
}

function formatCepInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length > 5) {
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }
  return digits;
}

function getInitialValues(customer: UICustomerDetail): AddressFormValues {
  return {
    zipCode: customer.zipCode ?? "",
    address: customer.address ?? "",
    addressNumber: customer.addressNumber ?? "",
    complement: customer.complement ?? "",
    neighborhood: customer.neighborhood ?? "",
    city: customer.city ?? "",
    state: customer.state ?? "",
    municipalityCode: hasValue(customer.cityCode)
      ? String(customer.cityCode)
      : "",
    stateCode: hasValue(customer.stateCode) ? String(customer.stateCode) : "",
  };
}

function isSameAddress(
  currentValues: AddressFormValues,
  initialValues: AddressFormValues,
): boolean {
  return JSON.stringify(currentValues) === JSON.stringify(initialValues);
}

interface CustomerProfileAddressSectionProps {
  customer: UICustomerDetail;
}

export function CustomerProfileAddressSection({
  customer,
}: CustomerProfileAddressSectionProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isCepLookupLoading, setIsCepLookupLoading] = useState(false);
  const [cepLookupMessage, setCepLookupMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [values, setValues] = useState<AddressFormValues>(() =>
    getInitialValues(customer),
  );

  const initialValues = getInitialValues(customer);
  const canEdit = customer.id > 0;

  useEffect(() => {
    setValues(getInitialValues(customer));
    setCepLookupMessage(null);
  }, [customer]);

  function handleChange(key: keyof AddressFormValues, value: string) {
    setValues((currentValues) => ({
      ...currentValues,
      [key]: key === "zipCode" ? formatCepInput(value) : value,
    }));

    if (key === "zipCode") {
      setCepLookupMessage(null);
    }
  }

  function handleCancel() {
    setValues(initialValues);
    setCepLookupMessage(null);
    setIsEditing(false);
  }

  async function handleLookupCep() {
    if (isCepLookupLoading || isPending) {
      return;
    }

    if (!validateCep(values.zipCode)) {
      setCepLookupMessage({
        type: "error",
        text: "Informe um CEP com 8 dígitos para buscar o endereço.",
      });
      return;
    }

    setIsCepLookupLoading(true);
    setCepLookupMessage(null);

    try {
      const addressData = await fetchAddressByCep(values.zipCode);

      if (!addressData) {
        setCepLookupMessage({
          type: "error",
          text: "Não foi possível localizar o endereço para este CEP.",
        });
        return;
      }

      setValues((currentValues) => ({
        ...currentValues,
        zipCode: formatCepValue(addressData.cep || currentValues.zipCode),
        address: addressData.street || currentValues.address,
        complement: addressData.complement || currentValues.complement,
        neighborhood: addressData.neighborhood || currentValues.neighborhood,
        city: addressData.city || currentValues.city,
        state: addressData.state || currentValues.state,
        municipalityCode:
          addressData.municipalityCode || currentValues.municipalityCode,
        stateCode: addressData.stateCode || currentValues.stateCode,
      }));

      setCepLookupMessage({
        type: "success",
        text: "Endereço preenchido com sucesso a partir do CEP!",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro inesperado ao buscar o CEP.";

      setCepLookupMessage({
        type: "error",
        text: message,
      });
    } finally {
      setIsCepLookupLoading(false);
    }
  }

  function handleSave() {
    if (!canEdit || isPending) {
      return;
    }

    if (isSameAddress(values, initialValues)) {
      setIsEditing(false);
      return;
    }

    startTransition(async () => {
      try {
        const result = await updateProfileCustomerAddressAction(
          customer.id,
          values,
        );

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success(result.message);
        setIsEditing(false);
        router.refresh();
      } catch (_error) {
        toast.error("Erro inesperado ao atualizar endereço.");
      }
    });
  }

  return (
    <div className="group/address-field space-y-5">
      {/* Edit Trigger Buttons */}
      <div className="flex justify-between items-center border-b border-border/40 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-500">
            <Navigation className="h-4.5 w-4.5 animate-pulse" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {isEditing
              ? "Editar Endereço Comercial"
              : "Localização de Faturamento"}
          </span>
        </div>

        <div>
          {isEditing ? (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isPending || isCepLookupLoading}
                className="rounded-full shadow-2xs h-8 px-3 text-xs"
                onClick={handleCancel}
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Cancelar
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={isPending || isCepLookupLoading}
                className="rounded-full shadow-2xs h-8 px-3 text-xs bg-sky-600 text-white hover:bg-sky-700"
                onClick={handleSave}
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Check className="h-3 w-3 mr-1" />
                    Salvar
                  </>
                )}
              </Button>
            </div>
          ) : (
            canEdit && (
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary dark:bg-white/[0.03]"
                onClick={() => setIsEditing(true)}
                title="Editar endereço"
              >
                <PencilLine className="h-3.5 w-3.5" />
                Editar Endereço
              </button>
            )
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-6">
          {/* Elegant ZIP/CEP Search Container */}
          <div className="rounded-2xl border border-sky-500/25 bg-gradient-to-r from-sky-500/[0.07] to-sky-500/[0.02] p-4 dark:from-sky-500/[0.12] dark:to-sky-500/[0.03]">
            <div className="flex flex-col gap-3 md:flex-row md:items-end">
              <div className="min-w-0 flex-1">
                <Label
                  htmlFor="profile-address-zip-code"
                  className="text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300"
                >
                  Buscar por CEP
                </Label>
                <Input
                  id="profile-address-zip-code"
                  value={values.zipCode}
                  inputMode="numeric"
                  placeholder="00000-000"
                  disabled={isPending || isCepLookupLoading}
                  className="mt-1.5 h-11 rounded-xl border-sky-500/20 bg-background font-mono text-lg font-bold tracking-[0.2em] shadow-2xs focus-visible:ring-sky-500/40 focus-visible:border-sky-500 dark:bg-background/40"
                  onChange={(event) =>
                    handleChange("zipCode", event.target.value)
                  }
                />
              </div>
              <Button
                type="button"
                variant="outline"
                disabled={isPending || isCepLookupLoading}
                className="h-11 rounded-xl border-sky-500/20 bg-background/80 px-4 hover:bg-sky-500/10 hover:text-sky-600 dark:bg-background/40"
                onClick={handleLookupCep}
              >
                {isCepLookupLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Buscar CEP
                  </>
                )}
              </Button>
            </div>
            {cepLookupMessage && (
              <p
                className={cn(
                  "mt-2 text-xs font-medium",
                  cepLookupMessage.type === "success"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-destructive",
                )}
              >
                {cepLookupMessage.text}
              </p>
            )}
          </div>

          {/* Form grid inputs */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ADDRESS_FIELDS.map((field) => {
              const Icon = field.icon;
              const inputId = `profile-address-${field.key}`;

              return (
                <div key={field.key} className="space-y-1.5">
                  <Label
                    htmlFor={inputId}
                    className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80"
                  >
                    {Icon && <Icon className="h-3 w-3 text-muted-foreground" />}
                    {field.label}
                  </Label>
                  <Input
                    id={inputId}
                    value={values[field.key]}
                    placeholder={field.placeholder}
                    inputMode={field.inputMode}
                    disabled={isPending}
                    className={cn(
                      "h-10 rounded-xl border-border/80 bg-background/80 shadow-2xs focus-visible:ring-primary/30 dark:bg-background/30",
                      field.mono && "font-mono tracking-wide",
                    )}
                    onChange={(event) =>
                      handleChange(field.key, event.target.value)
                    }
                  />
                </div>
              );
            })}

            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                <Globe className="h-3 w-3 text-muted-foreground" />
                País
              </Label>
              <Input
                value={customer.country || "Não informado"}
                readOnly
                disabled
                className="h-10 rounded-xl border-border/50 bg-muted/40 text-muted-foreground/85 shadow-none select-none font-medium dark:bg-white/[0.01]"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Read Only Postal Tag Banner */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-sky-500/20 bg-gradient-to-r from-sky-500/[0.08] to-sky-500/[0.02] p-4 dark:from-sky-500/[0.12] dark:to-sky-500/[0.03]">
            <div className="space-y-1">
              <div className="text-[9px] font-extrabold uppercase tracking-wider text-sky-700/80 dark:text-sky-300/85">
                Código Postal (CEP)
              </div>
              <p className="font-mono text-2xl font-black tracking-widest text-sky-700 dark:text-sky-300">
                {formatCep(customer.zipCode)}
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl bg-sky-500/10 px-3 py-1.5 text-[11px] font-bold text-sky-600 dark:bg-sky-500/20 dark:text-sky-300">
              <Globe className="h-3.5 w-3.5" />
              Brasil (BR)
            </div>
          </div>

          {/* Read Only grid details with neat circular icon badges */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-start gap-3 rounded-xl border border-border/40 p-3 transition-colors hover:bg-muted/10 dark:hover:bg-white/[0.01]">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-500">
                <MapPin className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground/80">
                  Endereço Logradouro
                </p>
                <p
                  className={cn(
                    "text-sm font-semibold mt-0.5 text-foreground truncate",
                    !hasValue(customer.address) &&
                      "italic font-normal text-muted-foreground/60",
                  )}
                >
                  {hasValue(customer.address)
                    ? customer.address
                    : "Não informado"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-border/40 p-3 transition-colors hover:bg-muted/10 dark:hover:bg-white/[0.01]">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground dark:bg-white/[0.03]">
                <Hash className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground/80">
                  Número
                </p>
                <p
                  className={cn(
                    "text-sm font-mono font-bold mt-0.5 text-foreground truncate",
                    !hasValue(customer.addressNumber) &&
                      "italic font-normal text-muted-foreground/60",
                  )}
                >
                  {hasValue(customer.addressNumber)
                    ? customer.addressNumber
                    : "S/N"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-border/40 p-3 transition-colors hover:bg-muted/10 dark:hover:bg-white/[0.01]">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground dark:bg-white/[0.03]">
                <Navigation className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground/80">
                  Complemento
                </p>
                <p
                  className={cn(
                    "text-sm font-semibold mt-0.5 text-foreground truncate",
                    !hasValue(customer.complement) &&
                      "italic font-normal text-muted-foreground/60",
                  )}
                >
                  {hasValue(customer.complement)
                    ? customer.complement
                    : "Não informado"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-border/40 p-3 transition-colors hover:bg-muted/10 dark:hover:bg-white/[0.01]">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground dark:bg-white/[0.03]">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground/80">
                  Bairro
                </p>
                <p
                  className={cn(
                    "text-sm font-semibold mt-0.5 text-foreground truncate",
                    !hasValue(customer.neighborhood) &&
                      "italic font-normal text-muted-foreground/60",
                  )}
                >
                  {hasValue(customer.neighborhood)
                    ? customer.neighborhood
                    : "Não informado"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-border/40 p-3 transition-colors hover:bg-muted/10 dark:hover:bg-white/[0.01]">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground dark:bg-white/[0.03]">
                <Globe className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground/80">
                  Cidade
                </p>
                <p
                  className={cn(
                    "text-sm font-semibold mt-0.5 text-foreground truncate",
                    !hasValue(customer.city) &&
                      "italic font-normal text-muted-foreground/60",
                  )}
                >
                  {hasValue(customer.city) ? customer.city : "Não informado"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-border/40 p-3 transition-colors hover:bg-muted/10 dark:hover:bg-white/[0.01]">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground dark:bg-white/[0.03]">
                <Globe className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground/80">
                  Estado (UF)
                </p>
                <p
                  className={cn(
                    "text-sm font-mono font-bold mt-0.5 text-foreground truncate",
                    !hasValue(customer.state) &&
                      "italic font-normal text-muted-foreground/60",
                  )}
                >
                  {hasValue(customer.state) ? customer.state : "Não informado"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-border/40 p-3 transition-colors hover:bg-muted/10 dark:hover:bg-white/[0.01]">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground dark:bg-white/[0.03]">
                <Hash className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground/80">
                  Código IBGE
                </p>
                <p
                  className={cn(
                    "text-sm font-mono mt-0.5 text-foreground truncate",
                    !hasValue(customer.cityCode) &&
                      "italic font-normal text-muted-foreground/60",
                  )}
                >
                  {hasValue(customer.cityCode)
                    ? String(customer.cityCode)
                    : "Não informado"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-border/40 p-3 transition-colors hover:bg-muted/10 dark:hover:bg-white/[0.01]">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground dark:bg-white/[0.03]">
                <Hash className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground/80">
                  Código UF
                </p>
                <p
                  className={cn(
                    "text-sm font-mono mt-0.5 text-foreground truncate",
                    !hasValue(customer.stateCode) &&
                      "italic font-normal text-muted-foreground/60",
                  )}
                >
                  {hasValue(customer.stateCode)
                    ? String(customer.stateCode)
                    : "Não informado"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
