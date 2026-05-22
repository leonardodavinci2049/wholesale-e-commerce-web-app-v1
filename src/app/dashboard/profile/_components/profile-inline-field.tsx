"use client";

import { Check, Loader2, PencilLine, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { updateProfileInlineFieldAction } from "../actions/update-profile-inline-field-action";

type ProfileEditableFieldKey =
  | "customerName"
  | "phone"
  | "whatsapp"
  | "email"
  | "companyName"
  | "tradeName"
  | "birthDate"
  | "sellerId";

type ProfileInlineFieldProps = {
  customerId: number;
  field: ProfileEditableFieldKey;
  value: string;
  displayValue?: string;
  emptyText?: string;
  variant?: "default" | "title";
  inputMode?: "text" | "tel" | "email" | "numeric" | "date";
  maxLength?: number;
  className?: string;
};

function hasContent(value: string | null | undefined): boolean {
  return (value ?? "").trim() !== "";
}

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

function getTodayDateInputValue(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDateInputValue(value: string): string {
  const trimmedValue = value.trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmedValue)) {
    return trimmedValue;
  }

  const isoDateMatch = trimmedValue.match(/^(\d{4}-\d{2}-\d{2})T/);
  if (isoDateMatch) {
    return isoDateMatch[1];
  }

  const brazilianDateMatch = trimmedValue.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (brazilianDateMatch) {
    const [, day, month, year] = brazilianDateMatch;
    return `${year}-${month}-${day}`;
  }

  return trimmedValue;
}

function formatPhoneInput(value: string): string {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length > 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  if (digits.length > 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  if (digits.length > 2) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  return digits;
}

function formatInputValue(
  field: ProfileEditableFieldKey,
  value: string,
): string {
  switch (field) {
    case "phone":
    case "whatsapp":
      return formatPhoneInput(value);
    case "birthDate":
      return formatDateInputValue(value);
    case "sellerId":
      return value;
    default:
      return value;
  }
}

function normalizeValue(field: ProfileEditableFieldKey, value: string): string {
  switch (field) {
    case "phone":
    case "whatsapp":
      return onlyDigits(value);
    case "birthDate": {
      if (!value) return "";
      const formattedDate = formatDateInputValue(value);
      if (/^\d{4}-\d{2}-\d{2}$/.test(formattedDate)) {
        return formattedDate;
      }

      const digits = onlyDigits(value);
      if (digits.length === 8) {
        return `${digits.slice(4, 8)}-${digits.slice(2, 4)}-${digits.slice(0, 2)}`;
      }
      return value.trim();
    }
    default:
      return value.trim();
  }
}

function getInputMode(
  field: ProfileEditableFieldKey,
): "text" | "tel" | "email" | "numeric" {
  switch (field) {
    case "phone":
    case "whatsapp":
      return "tel";
    case "email":
      return "email";
    case "birthDate":
      return "text";
    case "sellerId":
      return "numeric";
    default:
      return "text";
  }
}

function getMaxLength(field: ProfileEditableFieldKey): number {
  switch (field) {
    case "customerName":
    case "email":
    case "companyName":
    case "tradeName":
      return 200;
    case "phone":
    case "whatsapp":
      return 15;
    case "birthDate":
      return 10;
    case "sellerId":
      return 10;
    default:
      return 200;
  }
}

export function ProfileInlineField({
  customerId,
  field,
  value,
  displayValue,
  emptyText = "Não informado",
  variant = "default",
  className,
}: ProfileInlineFieldProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(() =>
    formatInputValue(field, value ?? ""),
  );
  const [isPending, startTransition] = useTransition();

  const inputMode = getInputMode(field);
  const maxLength = getMaxLength(field);
  const normalizedInitialValue = normalizeValue(field, value ?? "");
  const hasCurrentValue = hasContent(value);
  const maxDate = field === "birthDate" ? getTodayDateInputValue() : undefined;

  useEffect(() => {
    setInputValue(formatInputValue(field, value ?? ""));
  }, [field, value]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  function handleCancel() {
    setInputValue(formatInputValue(field, value ?? ""));
    setIsEditing(false);
  }

  function handleSave() {
    if (isPending) return;

    const normalizedValue = normalizeValue(field, inputValue);

    if (normalizedValue === normalizedInitialValue) {
      setIsEditing(false);
      return;
    }

    startTransition(async () => {
      try {
        const result = await updateProfileInlineFieldAction(
          customerId,
          field,
          normalizedValue,
        );

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success(result.message);
        setIsEditing(false);
        router.refresh();
      } catch (_error) {
        toast.error("Erro inesperado ao atualizar campo do perfil");
      }
    });
  }

  function renderActions() {
    if (!isEditing) {
      return (
        <button
          type="button"
          className="shrink-0 opacity-40 transition-opacity [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/inline-field:opacity-100"
          onClick={() => setIsEditing(true)}
          title="Editar"
        >
          <PencilLine className="h-3 w-3 text-muted-foreground" />
        </button>
      );
    }

    return (
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
          className="rounded-full"
          onClick={handleCancel}
        >
          <X className="h-4 w-4" />
          Cancelar
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={isPending}
          className="rounded-full"
          onClick={handleSave}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              Salvar
            </>
          )}
        </Button>
      </div>
    );
  }

  const inputType = field === "birthDate" ? "date" : "text";

  if (variant === "title") {
    return (
      <div className={cn("group/inline-field", className)}>
        {isEditing ? (
          <div className="space-y-3">
            <Input
              ref={inputRef}
              type={inputType}
              value={inputValue}
              inputMode={field === "birthDate" ? undefined : inputMode}
              max={maxDate}
              maxLength={maxLength}
              disabled={isPending}
              className="h-11 rounded-2xl border-border/70 bg-background/80 text-lg font-semibold tracking-tight shadow-none md:text-xl dark:bg-background/40"
              onChange={(event) =>
                setInputValue(
                  field === "phone" || field === "whatsapp"
                    ? formatPhoneInput(event.target.value)
                    : event.target.value,
                )
              }
            />
            <div className="flex flex-wrap gap-2">{renderActions()}</div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h4
              className={cn(
                "text-xl font-semibold tracking-tight text-foreground md:text-2xl",
                !hasCurrentValue && "italic text-muted-foreground/60",
              )}
            >
              {hasCurrentValue ? (displayValue ?? value) : emptyText}
            </h4>
            {renderActions()}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("group/inline-field", className)}>
      {isEditing ? (
        <div className="space-y-2">
          <Input
            ref={inputRef}
            type={inputType}
            value={inputValue}
            inputMode={field === "birthDate" ? undefined : inputMode}
            max={maxDate}
            maxLength={maxLength}
            disabled={isPending}
            className="h-10 rounded-xl border-border/70 bg-background/80 text-sm font-medium shadow-none dark:bg-background/40"
            onChange={(event) =>
              setInputValue(
                field === "phone" || field === "whatsapp"
                  ? formatPhoneInput(event.target.value)
                  : event.target.value,
              )
            }
          />
          <div className="flex flex-wrap gap-2">{renderActions()}</div>
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          <p
            className={cn(
              "text-sm font-semibold text-foreground",
              !hasCurrentValue && "italic font-normal text-muted-foreground/60",
            )}
          >
            {hasCurrentValue ? (displayValue ?? value) : emptyText}
          </p>
          {renderActions()}
        </div>
      )}
    </div>
  );
}
