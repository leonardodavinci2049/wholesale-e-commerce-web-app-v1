import Image from "next/image";
import { companyInfo } from "@/core/config-tenant/info-company";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  imageClassName?: string;
  variant?: "default" | "badge";
}

export default function Logo({
  className,
  imageClassName,
  variant = "default",
}: LogoProps) {
  if (variant === "badge") {
    return (
      <div
        className={cn(
          "relative flex size-16 items-center justify-center overflow-hidden rounded-full border-4 border-white/85 bg-white/20 shadow-[0_12px_24px_-10px_rgb(168_85_247/0.45)] ring-1 ring-pink-200/70 backdrop-blur-sm sm:size-18",
          className,
        )}
      >
        <Image
          src="/images/logo/logo-header.png"
          alt={`${companyInfo.name || "Logo"} Logo`}
          fill
          loading="eager"
          sizes="72px"
          className={cn("object-cover object-center", imageClassName)}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "mt-4 flex flex-col items-center justify-center",
        className,
      )}
    >
      <Image
        src="/images/logo/logo-header.png"
        alt={`${companyInfo.name || "Logo"} Logo`}
        width={200}
        height={64}
        loading="eager"
        className={cn("h-16 w-auto sm:h-20", imageClassName)}
      />
    </div>
  );
}
