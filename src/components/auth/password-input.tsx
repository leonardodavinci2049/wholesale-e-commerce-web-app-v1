"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { type ComponentProps, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function PasswordInput({
  className,
  ...props
}: Omit<ComponentProps<typeof Input>, "type">) {
  const [showPassword, setShowPassword] = useState(false);
  const Icon = showPassword ? EyeOffIcon : EyeIcon;
  const toggleLabel = showPassword ? "Ocultar senha" : "Mostrar senha";

  return (
    <div className="relative">
      <Input
        {...props}
        type={showPassword ? "text" : "password"}
        className={cn("pr-9", className)}
      />
      <Button
        variant="ghost"
        size="icon"
        type="button"
        className="absolute inset-y-1/2 right-1 size-7 -translate-y-1/2"
        onClick={() => setShowPassword((p) => !p)}
        aria-label={toggleLabel}
        aria-pressed={showPassword}
        title={toggleLabel}
      >
        <Icon className="size-5" />
      </Button>
    </div>
  );
}
