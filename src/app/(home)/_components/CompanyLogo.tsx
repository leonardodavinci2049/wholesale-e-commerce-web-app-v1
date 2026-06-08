import Image from "next/image";
import { publicEnvs } from "@/core/config/envs.client";

export default function CompanyLogo() {
  return (
    <div className="flex items-center space-x-2">
      <Image
        src="/images/logo/logo-header.png"
        alt={`${publicEnvs.NEXT_PUBLIC_COMPANY_NAME} Logo`}
        width={64}
        height={32}
        className="h-8 w-16 sm:h-10 sm:w-20"
      />
      <span className="text-lg font-bold sm:text-xl">
        {publicEnvs.NEXT_PUBLIC_COMPANY_NAME}
      </span>
    </div>
  );
}
