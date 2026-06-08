"use client";

import { CircleUserRound, MessageCircle, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * Minimal client component for user-specific header actions
 * Handles cart count, user menu, and authentication state
 * Isolated from server-rendered header for cache optimization
 */
export function OperationButtons() {
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex items-center gap-6 text-sm font-medium text-foreground">
      <Button
        variant="default"
        size="lg"
        className="hidden min-w-[156px] shadow-md shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25 lg:inline-flex"
        asChild
      >
        <Link href="/dashboard" aria-label="Acessar Área do Cliente">
          <CircleUserRound className="h-4 w-4" />
          <span>Área do Cliente</span>
        </Link>
      </Button>

      <a
        href="/contact"
        className="flex flex-col items-center gap-1 hover:text-primary transition-colors group"
      >
        <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
        <span className="hidden lg:inline">Fale Conosco</span>
      </a>

      {/* Theme Toggle */}
      <button
        type="button"
        className="flex flex-col items-center gap-1 hover:text-primary transition-colors group"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {mounted && theme === "dark" ? (
          <Sun className="w-6 h-6 group-hover:scale-110 transition-transform" />
        ) : (
          <Moon className="w-6 h-6 group-hover:scale-110 transition-transform" />
        )}
        <span className="hidden lg:inline">Tema</span>
      </button>
    </div>
  );
}
