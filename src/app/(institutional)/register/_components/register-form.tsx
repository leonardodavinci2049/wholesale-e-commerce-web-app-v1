"use client";

import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Loader2,
  LogIn,
  MessageCircle,
  Search,
} from "lucide-react";
import Link from "next/link";
import {
  useActionState,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { formatStateOptions } from "@/core/constants/brazilian-states";
import { cn } from "@/lib/utils";
import { fetchAddressByCep } from "@/services/api-cep/cep-service";
import { trackEvent } from "../_lib/tracking";
import { WHATSAPP_PRECADASTRO_URL } from "../_lib/whatsapp";
import {
  type RegisterLeadState,
  submitRegisterLead,
} from "../actions/submit-register-lead";

type PersonType = "PJ" | "PF";

type FormValues = Record<string, string>;

const INITIAL_VALUES: FormValues = {
  personType: "PJ",
  name: "",
  email: "",
  cnpj: "",
  companyName: "",
  cpf: "",
  phone: "",
  whatsapp: "",
  zipCode: "",
  address: "",
  addressNumber: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  notes: "",
};

const UF_OPTIONS = formatStateOptions();
const FORM_CONTROL_CLASS =
  "border-border/70 bg-input shadow-inner dark:border-border/60 dark:bg-input/80";

const onlyDigits = (value: string): string => value.replace(/\D/g, "");

const maskCep = (value: string): string => {
  const digits = onlyDigits(value).slice(0, 8);
  return digits.length > 5
    ? `${digits.slice(0, 5)}-${digits.slice(5)}`
    : digits;
};

const maskPhone = (value: string): string => {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length > 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  if (digits.length > 6)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  if (digits.length > 2) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return digits;
};

const maskCnpj = (value: string): string => {
  const digits = onlyDigits(value).slice(0, 14);
  if (digits.length > 12)
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
  if (digits.length > 8)
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  if (digits.length > 5)
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length > 2) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  return digits;
};

const maskCpf = (value: string): string => {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length > 9)
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  if (digits.length > 6)
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  if (digits.length > 3) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  return digits;
};

type CepStatus = {
  state: "idle" | "loading" | "error" | "success";
  message?: string;
};

export function RegisterForm() {
  const reactId = useId();
  const [state, formAction, isPending] = useActionState<
    RegisterLeadState,
    FormData
  >(submitRegisterLead, null);

  const [values, setValues] = useState<FormValues>(() => ({
    ...INITIAL_VALUES,
    ...(state?.status === "error" ? state.values : {}),
  }));
  const [cepStatus, setCepStatus] = useState<CepStatus>({ state: "idle" });

  const formRef = useRef<HTMLFormElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const lastCepLookupRef = useRef<string | null>(null);
  const personType = (values.personType as PersonType) ?? "PJ";
  const isPJ = personType === "PJ";
  const errors = state?.status === "error" ? state.errors : undefined;

  const fieldId = (name: string) => `${reactId}-${name}`;
  const errorId = (name: string) => `${reactId}-${name}-error`;

  const setField = (name: string, value: string): void => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFirstFocus = (): void => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackEvent("register_form_start");
  };

  const handleCepLookup = useCallback(
    async (
      options: { force?: boolean; showInvalidMessage?: boolean } = {},
    ): Promise<void> => {
      const digits = onlyDigits(values.zipCode);
      if (digits.length !== 8) {
        if (options.showInvalidMessage) {
          setCepStatus({
            state: "error",
            message: "Informe um CEP com 8 dígitos para buscar o endereço.",
          });
        }
        return;
      }

      if (!options.force && lastCepLookupRef.current === digits) return;

      lastCepLookupRef.current = digits;
      setCepStatus({ state: "loading" });
      try {
        const address = await fetchAddressByCep(values.zipCode);
        if (!address) {
          setCepStatus({
            state: "error",
            message:
              "Não conseguimos localizar esse CEP. Você pode preencher o endereço manualmente.",
          });
          return;
        }

        setValues((prev) => ({
          ...prev,
          zipCode: address.cep || prev.zipCode,
          address: address.street || prev.address,
          complement: prev.complement || address.complement || "",
          neighborhood: address.neighborhood || prev.neighborhood,
          city: address.city || prev.city,
          state: address.state || prev.state,
        }));
        setCepStatus({
          state: "success",
          message: "Endereço preenchido pelo CEP.",
        });
      } catch {
        setCepStatus({
          state: "error",
          message:
            "Não conseguimos localizar esse CEP. Você pode preencher o endereço manualmente.",
        });
      }
    },
    [values.zipCode],
  );

  useEffect(() => {
    const digits = onlyDigits(values.zipCode);

    if (digits.length < 8) {
      lastCepLookupRef.current = null;
      if (cepStatus.state !== "idle") {
        setCepStatus({ state: "idle" });
      }
      return;
    }

    if (digits.length === 8) {
      void handleCepLookup();
    }
  }, [values.zipCode, cepStatus.state, handleCepLookup]);

  // Tracking de resultado + foco no primeiro campo inválido.
  useEffect(() => {
    if (!state) return;
    if (state.status === "success") {
      trackEvent("register_submit_success");
      return;
    }
    trackEvent("register_submit_error", {
      duplicate: state.isDuplicate === true,
    });
    toast.error(
      state.isDuplicate
        ? "Cadastro já existente. Confira o aviso no formulário."
        : "Não foi possível enviar o pré-cadastro. Confira o aviso no formulário.",
      {
        description: state.message,
      },
    );

    feedbackRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    const firstInvalid = formRef.current?.querySelector<HTMLElement>(
      '[aria-invalid="true"]',
    );
    firstInvalid?.focus({ preventScroll: true });
  }, [state]);

  // Sucesso: substitui o formulário pela confirmação.
  if (state?.status === "success") {
    return <RegisterSuccessCard customerId={state.customerId} />;
  }

  const isDuplicate = state?.status === "error" && state.isDuplicate === true;
  const cepDigits = onlyDigits(values.zipCode);
  const canLookupCep =
    cepDigits.length === 8 && !isPending && cepStatus.state !== "loading";

  return (
    <Card className="group/form-card relative overflow-hidden border-border/60 shadow-lg ring-1 ring-primary/5">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/8 to-transparent"
      />
      <CardContent className="relative flex flex-col gap-5 px-4 py-5 sm:px-7 sm:py-6">
        <header className="flex flex-col gap-1.5">
          <div className="inline-flex items-center gap-2 text-primary">
            <span className="inline-flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <ClipboardList className="size-4" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wide">
              Pré-cadastro
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
            Solicite seu acesso comercial
          </h2>
          <p className="text-sm text-muted-foreground">
            É rápido e não exige senha nesta etapa.
          </p>
        </header>

        <div ref={feedbackRef}>
          {isDuplicate && (
            <Alert className="border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-500/50 dark:bg-amber-950/30 dark:text-amber-100">
              <AlertCircle className="text-amber-600 dark:text-amber-300" />
              <AlertTitle>Cadastro já existente</AlertTitle>
              <AlertDescription>
                {state?.status === "error" ? state.message : null}{" "}
                <Link
                  href="/sign-in"
                  className="font-medium text-amber-800 underline-offset-4 hover:underline dark:text-amber-200"
                >
                  Ir para o login
                </Link>{" "}
                ou{" "}
                <a
                  href={WHATSAPP_PRECADASTRO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-amber-800 underline-offset-4 hover:underline dark:text-amber-200"
                >
                  falar no WhatsApp
                </a>
                .
              </AlertDescription>
            </Alert>
          )}

          {state?.status === "error" && !isDuplicate && (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>Não foi possível enviar</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
        </div>

        <form
          ref={formRef}
          action={formAction}
          onFocus={handleFirstFocus}
          className="flex flex-col gap-5"
          noValidate
        >
          {/* Honeypot anti-bot */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />

          {/* Tipo de pessoa */}
          <input type="hidden" name="personType" value={personType} />
          <fieldset className="flex flex-col gap-2 border-0 p-0">
            <legend className="text-sm font-medium">Tipo de cadastro</legend>
            <div className="grid grid-cols-2 gap-2">
              <PersonTypeButton
                active={isPJ}
                label="Pessoa Jurídica"
                onClick={() => setField("personType", "PJ")}
              />
              <PersonTypeButton
                active={!isPJ}
                label="Pessoa Física"
                onClick={() => setField("personType", "PF")}
              />
            </div>
          </fieldset>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Nome do responsável */}
            <FormField
              id={fieldId("name")}
              label="Nome do responsável"
              required
              error={errors?.name}
              errorId={errorId("name")}
              className="sm:col-span-2"
            >
              <Input
                id={fieldId("name")}
                name="name"
                className={FORM_CONTROL_CLASS}
                value={values.name}
                onChange={(e) => setField("name", e.target.value)}
                disabled={isPending}
                autoComplete="name"
                aria-invalid={!!errors?.name}
                aria-describedby={errors?.name ? errorId("name") : undefined}
              />
            </FormField>

            {/* E-mail */}
            <FormField
              id={fieldId("email")}
              label="E-mail comercial"
              required
              error={errors?.email}
              errorId={errorId("email")}
              className="sm:col-span-2"
            >
              <Input
                id={fieldId("email")}
                name="email"
                type="email"
                className={FORM_CONTROL_CLASS}
                value={values.email}
                onChange={(e) => setField("email", e.target.value)}
                disabled={isPending}
                autoComplete="email"
                aria-invalid={!!errors?.email}
                aria-describedby={errors?.email ? errorId("email") : undefined}
              />
            </FormField>

            {isPJ ? (
              <>
                {/* CNPJ */}
                <FormField
                  id={fieldId("cnpj")}
                  label="CNPJ"
                  required
                  error={errors?.cnpj}
                  errorId={errorId("cnpj")}
                >
                  <Input
                    id={fieldId("cnpj")}
                    name="cnpj"
                    inputMode="numeric"
                    className={FORM_CONTROL_CLASS}
                    value={values.cnpj}
                    onChange={(e) => setField("cnpj", maskCnpj(e.target.value))}
                    disabled={isPending}
                    aria-invalid={!!errors?.cnpj}
                    aria-describedby={
                      errors?.cnpj ? errorId("cnpj") : undefined
                    }
                  />
                </FormField>

                {/* Razão social */}
                <FormField
                  id={fieldId("companyName")}
                  label="Razão social / empresa"
                  required
                  error={errors?.companyName}
                  errorId={errorId("companyName")}
                >
                  <Input
                    id={fieldId("companyName")}
                    name="companyName"
                    className={FORM_CONTROL_CLASS}
                    value={values.companyName}
                    onChange={(e) => setField("companyName", e.target.value)}
                    disabled={isPending}
                    aria-invalid={!!errors?.companyName}
                    aria-describedby={
                      errors?.companyName ? errorId("companyName") : undefined
                    }
                  />
                </FormField>
              </>
            ) : (
              <FormField
                id={fieldId("cpf")}
                label="CPF"
                required
                error={errors?.cpf}
                errorId={errorId("cpf")}
                className="sm:col-span-2"
              >
                <Input
                  id={fieldId("cpf")}
                  name="cpf"
                  inputMode="numeric"
                  className={FORM_CONTROL_CLASS}
                  value={values.cpf}
                  onChange={(e) => setField("cpf", maskCpf(e.target.value))}
                  disabled={isPending}
                  aria-invalid={!!errors?.cpf}
                  aria-describedby={errors?.cpf ? errorId("cpf") : undefined}
                />
              </FormField>
            )}

            {/* Telefone */}
            <FormField
              id={fieldId("phone")}
              label="Telefone"
              error={errors?.phone}
              errorId={errorId("phone")}
            >
              <Input
                id={fieldId("phone")}
                name="phone"
                inputMode="numeric"
                className={FORM_CONTROL_CLASS}
                value={values.phone}
                onChange={(e) => setField("phone", maskPhone(e.target.value))}
                disabled={isPending}
                autoComplete="tel"
                aria-invalid={!!errors?.phone}
                aria-describedby={errors?.phone ? errorId("phone") : undefined}
              />
            </FormField>

            {/* WhatsApp */}
            <FormField
              id={fieldId("whatsapp")}
              label="WhatsApp"
              required
              error={errors?.whatsapp}
              errorId={errorId("whatsapp")}
            >
              <Input
                id={fieldId("whatsapp")}
                name="whatsapp"
                inputMode="numeric"
                className={FORM_CONTROL_CLASS}
                value={values.whatsapp}
                onChange={(e) =>
                  setField("whatsapp", maskPhone(e.target.value))
                }
                disabled={isPending}
                autoComplete="tel"
                aria-invalid={!!errors?.whatsapp}
                aria-describedby={
                  errors?.whatsapp ? errorId("whatsapp") : undefined
                }
              />
            </FormField>

            {/* CEP */}
            <FormField
              id={fieldId("zipCode")}
              label="CEP"
              required
              error={errors?.zipCode}
              errorId={errorId("zipCode")}
              hint={cepStatus.message}
            >
              <div className="flex items-center gap-2">
                <Input
                  id={fieldId("zipCode")}
                  name="zipCode"
                  inputMode="numeric"
                  className={FORM_CONTROL_CLASS}
                  value={values.zipCode}
                  onChange={(e) => setField("zipCode", maskCep(e.target.value))}
                  disabled={isPending || cepStatus.state === "loading"}
                  aria-invalid={!!errors?.zipCode}
                  aria-describedby={
                    errors?.zipCode ? errorId("zipCode") : undefined
                  }
                />
                {cepStatus.state === "loading" ? (
                  <Spinner className="size-4 shrink-0 text-muted-foreground" />
                ) : null}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-10 shrink-0 cursor-pointer px-3"
                  disabled={!canLookupCep}
                  onClick={() =>
                    void handleCepLookup({
                      force: true,
                      showInvalidMessage: true,
                    })
                  }
                >
                  <Search className="mr-2 size-4" />
                  Buscar
                </Button>
              </div>
            </FormField>

            {/* UF */}
            <FormField
              id={fieldId("state")}
              label="Estado (UF)"
              required
              error={errors?.state}
              errorId={errorId("state")}
            >
              <Select
                name="state"
                value={values.state}
                onValueChange={(value) => setField("state", value)}
                disabled={isPending}
              >
                <SelectTrigger
                  id={fieldId("state")}
                  aria-invalid={!!errors?.state}
                  aria-describedby={
                    errors?.state ? errorId("state") : undefined
                  }
                  className={cn("w-full", FORM_CONTROL_CLASS)}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UF_OPTIONS.map((uf) => (
                    <SelectItem key={uf.value} value={uf.value}>
                      {uf.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            {/* Endereço */}
            <FormField
              id={fieldId("address")}
              label="Endereço"
              required
              error={errors?.address}
              errorId={errorId("address")}
            >
              <Input
                id={fieldId("address")}
                name="address"
                className={FORM_CONTROL_CLASS}
                value={values.address}
                onChange={(e) => setField("address", e.target.value)}
                disabled={isPending}
                autoComplete="street-address"
                aria-invalid={!!errors?.address}
                aria-describedby={
                  errors?.address ? errorId("address") : undefined
                }
              />
            </FormField>

            {/* Número */}
            <FormField
              id={fieldId("addressNumber")}
              label="Número"
              required
              error={errors?.addressNumber}
              errorId={errorId("addressNumber")}
            >
              <Input
                id={fieldId("addressNumber")}
                name="addressNumber"
                className={FORM_CONTROL_CLASS}
                value={values.addressNumber}
                onChange={(e) => setField("addressNumber", e.target.value)}
                disabled={isPending}
                aria-invalid={!!errors?.addressNumber}
                aria-describedby={
                  errors?.addressNumber ? errorId("addressNumber") : undefined
                }
              />
            </FormField>

            {/* Complemento */}
            <FormField
              id={fieldId("complement")}
              label="Complemento"
              error={errors?.complement}
              errorId={errorId("complement")}
              className="sm:col-span-2"
            >
              <Input
                id={fieldId("complement")}
                name="complement"
                className={FORM_CONTROL_CLASS}
                value={values.complement}
                onChange={(e) => setField("complement", e.target.value)}
                disabled={isPending}
                aria-invalid={!!errors?.complement}
                aria-describedby={
                  errors?.complement ? errorId("complement") : undefined
                }
              />
            </FormField>

            {/* Bairro */}
            <FormField
              id={fieldId("neighborhood")}
              label="Bairro"
              required
              error={errors?.neighborhood}
              errorId={errorId("neighborhood")}
            >
              <Input
                id={fieldId("neighborhood")}
                name="neighborhood"
                className={FORM_CONTROL_CLASS}
                value={values.neighborhood}
                onChange={(e) => setField("neighborhood", e.target.value)}
                disabled={isPending}
                aria-invalid={!!errors?.neighborhood}
                aria-describedby={
                  errors?.neighborhood ? errorId("neighborhood") : undefined
                }
              />
            </FormField>

            {/* Cidade */}
            <FormField
              id={fieldId("city")}
              label="Cidade"
              required
              error={errors?.city}
              errorId={errorId("city")}
            >
              <Input
                id={fieldId("city")}
                name="city"
                className={FORM_CONTROL_CLASS}
                value={values.city}
                onChange={(e) => setField("city", e.target.value)}
                disabled={isPending}
                aria-invalid={!!errors?.city}
                aria-describedby={errors?.city ? errorId("city") : undefined}
              />
            </FormField>

            {/* Observações comerciais */}
            <FormField
              id={fieldId("notes")}
              label="Observações comerciais"
              error={errors?.notes}
              errorId={errorId("notes")}
              className="sm:col-span-2"
            >
              <Textarea
                id={fieldId("notes")}
                name="notes"
                className={FORM_CONTROL_CLASS}
                value={values.notes}
                onChange={(e) => setField("notes", e.target.value)}
                disabled={isPending}
                rows={3}
                aria-invalid={!!errors?.notes}
                aria-describedby={errors?.notes ? errorId("notes") : undefined}
              />
            </FormField>
          </div>

          <div className="flex flex-col gap-2.5">
            <Button
              type="submit"
              size="lg"
              disabled={isPending}
              className="w-full cursor-pointer shadow-md transition-transform active:scale-[0.99]"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Enviando pré-cadastro...
                </>
              ) : (
                <>
                  Enviar pré-cadastro
                  <ArrowRight className="ml-2 size-4" />
                </>
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Seus dados são usados apenas para análise do cadastro e contato
              comercial.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function PersonTypeButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "h-10 rounded-xl border px-3 text-sm font-medium transition-all active:scale-[0.98]",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-input/40 text-foreground hover:border-primary/40 hover:bg-muted",
      )}
    >
      {label}
    </button>
  );
}

function FormField({
  id,
  label,
  required,
  error,
  errorId,
  hint,
  className,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  errorId?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={id}>
        {label}
        {required ? (
          <span className="text-destructive" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </Label>
      {children}
      {hint && !error ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function RegisterSuccessCard({ customerId }: { customerId?: number }) {
  return (
    <Card className="relative overflow-hidden border-chart-2/30 shadow-lg ring-1 ring-chart-2/10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-chart-2/10 to-transparent"
      />
      <CardContent className="relative flex flex-col items-center gap-4 px-5 py-9 text-center sm:px-8">
        <span className="inline-flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-chart-2/20 to-chart-4/20 text-chart-2 shadow-sm">
          <CheckCircle2 className="size-8" />
        </span>
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
          Pré-cadastro recebido!
        </h2>
        <p className="max-w-md text-sm text-muted-foreground">
          Vamos analisar suas informações e retornar pelo WhatsApp ou e-mail
          informado.
        </p>
        {customerId ? (
          <div className="w-full max-w-md rounded-lg border border-chart-2/30 bg-chart-2/10 px-4 py-3 text-sm">
            <p className="font-semibold text-foreground">
              Seu número de cadastro é {customerId}.
            </p>
            <p className="mt-1 text-muted-foreground">
              Anote esse número e informe ao atendimento quando entrar em
              contato.
            </p>
          </div>
        ) : null}
        <div className="mt-2 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild className="w-full cursor-pointer shadow-md sm:w-auto">
            <a
              href={WHATSAPP_PRECADASTRO_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="mr-2 size-4" />
              Falar no WhatsApp
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full cursor-pointer sm:w-auto"
          >
            <Link href="/sign-in">
              <LogIn className="mr-2 size-4" />
              Ir para o login
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
