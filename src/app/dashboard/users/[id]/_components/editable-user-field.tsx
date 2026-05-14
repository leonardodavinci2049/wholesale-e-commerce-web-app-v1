"use client";

import {
  Check,
  Fingerprint,
  Loader2,
  Mail,
  Pencil,
  Shield,
  User,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { updateUserFieldAction } from "./update-user-field-action";

type EditableUserFieldName =
  | "name"
  | "email"
  | "role"
  | "personId"
  | "sellerId";
type EditableUserFieldValue = string | number | null | undefined;

interface EditableUserFieldProps {
  userId: string;
  field: EditableUserFieldName;
  label: string;
  value: EditableUserFieldValue;
  inputType?: "text" | "email" | "number";
  className?: string;
}

const fieldIcons = {
  name: User,
  email: Mail,
  role: Shield,
  personId: Fingerprint,
  sellerId: Fingerprint,
} as const;

function formatDraftValue(value: EditableUserFieldValue): string {
  return value === null || value === undefined ? "" : String(value);
}

function formatDisplayValue(value: EditableUserFieldValue): string {
  return value === null || value === undefined || value === ""
    ? "N/A"
    : String(value);
}

export function EditableUserField({
  userId,
  field,
  label,
  value,
  inputType = "text",
  className,
}: EditableUserFieldProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [currentValue, setCurrentValue] =
    useState<EditableUserFieldValue>(value);
  const [draftValue, setDraftValue] = useState(formatDraftValue(value));
  const Icon = fieldIcons[field];

  function startEditing() {
    setDraftValue(formatDraftValue(currentValue));
    setIsEditing(true);
  }

  function cancelEditing() {
    setDraftValue(formatDraftValue(currentValue));
    setIsEditing(false);
  }

  function saveValue() {
    startTransition(async () => {
      const result = await updateUserFieldAction({
        userId,
        field,
        value: draftValue,
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      setCurrentValue(result.value);
      setDraftValue(formatDraftValue(result.value));
      setIsEditing(false);
      toast.success(result.message);
      router.refresh();
    });
  }

  return (
    <div className="flex min-h-20 flex-col justify-center space-y-1.5 rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted">
      <span className="mb-auto flex items-center gap-2 text-xs font-medium tracking-wider text-muted-foreground uppercase">
        <Icon className="h-3.5 w-3.5" /> {label}
      </span>

      {isEditing ? (
        <form
          className="flex items-center gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            saveValue();
          }}
        >
          {field === "role" ? (
            <Select
              value={draftValue || "user"}
              onValueChange={setDraftValue}
              disabled={isPending}
            >
              <SelectTrigger className="h-8 min-w-28 flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">user</SelectItem>
                <SelectItem value="admin">admin</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Input
              autoFocus
              className="h-8 flex-1 rounded-lg px-2 text-sm"
              min={inputType === "number" ? 0 : undefined}
              onChange={(event) => setDraftValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.preventDefault();
                  cancelEditing();
                }
              }}
              type={inputType}
              value={draftValue}
              disabled={isPending}
            />
          )}

          <Button type="submit" size="icon-xs" disabled={isPending}>
            {isPending ? <Loader2 className="animate-spin" /> : <Check />}
            <span className="sr-only">Salvar</span>
          </Button>
          <Button
            type="button"
            size="icon-xs"
            variant="ghost"
            disabled={isPending}
            onClick={cancelEditing}
          >
            <X />
            <span className="sr-only">Cancelar</span>
          </Button>
        </form>
      ) : (
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "min-w-0 flex-1 truncate font-semibold text-lg leading-tight",
              className,
            )}
          >
            {field === "role" ? (
              <Badge
                variant={currentValue === "admin" ? "default" : "secondary"}
              >
                {formatDisplayValue(currentValue)}
              </Badge>
            ) : (
              formatDisplayValue(currentValue)
            )}
          </div>
          <Button
            type="button"
            size="icon-xs"
            variant="ghost"
            onClick={startEditing}
          >
            <Pencil />
            <span className="sr-only">Editar {label}</span>
          </Button>
        </div>
      )}
    </div>
  );
}
