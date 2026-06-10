import Image from "next/image";
import { companyInfo } from "@/data/info-company";

export default function CompanyLogo() {
  return (
    <div className="flex items-center space-x-2">
      <Image
        src="/images/logo/logo-header.png"
        alt={`${companyInfo.name} Logo`}
        width={64}
        height={32}
        className="h-8 w-16 sm:h-10 sm:w-20"
      />
      <span className="text-lg font-bold sm:text-xl">{companyInfo.name}</span>
    </div>
  );
}
