import Image from "next/image";
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
          "relative flex size-16 items-center justify-center overflow-hidden rounded-full border-4 border-white/85 bg-white/20 shadow-[0_12px_24px_-10px_rgb(168_85_247_/_0.45)] ring-1 ring-pink-200/70 backdrop-blur-sm sm:size-[4.5rem]",
          className,
        )}
      >
        <Image
          src="/images/logo/logo-header.png"
          alt={`${process.env.NEXT_PUBLIC_COMPANY_NAME || "Logo"} Logo`}
          fill
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
        alt={`${process.env.NEXT_PUBLIC_COMPANY_NAME || "Logo"} Logo`}
        width={200}
        height={64}
        className={cn("h-16 w-auto sm:h-20", imageClassName)}
      />
    </div>
  );
}
