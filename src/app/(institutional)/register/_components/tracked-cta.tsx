"use client";

import Link from "next/link";
import type * as React from "react";
import { Button } from "@/components/ui/button";
import { type TrackingEvent, trackEvent } from "../_lib/tracking";

interface TrackedCtaProps {
  event: TrackingEvent;
  href: string;
  children: React.ReactNode;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
  className?: string;
  external?: boolean;
  payload?: Record<string, unknown>;
}

/**
 * CTA (botão/link) que dispara um evento de tracking no clique.
 *
 * - `external` renderiza um `<a>` (ex.: WhatsApp) abrindo em nova aba.
 * - Caso contrário usa o `<Link>` do Next (ex.: âncora #formulario ou rota).
 */
export function TrackedCta({
  event,
  href,
  children,
  variant = "default",
  size = "default",
  className,
  external = false,
  payload,
}: TrackedCtaProps) {
  const handleClick = () => trackEvent(event, payload);

  if (external) {
    return (
      <Button asChild variant={variant} size={size} className={className}>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
        >
          {children}
        </a>
      </Button>
    );
  }

  return (
    <Button asChild variant={variant} size={size} className={className}>
      <Link href={href} onClick={handleClick}>
        {children}
      </Link>
    </Button>
  );
}
