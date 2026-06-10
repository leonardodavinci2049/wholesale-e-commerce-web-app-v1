"use client";

import { useEffect, useState } from "react";
import { companyInfo } from "@/core/config-tenant/info-company";

export default function CompanyFooter() {
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(String(new Date().getFullYear()));
  }, []);

  return (
    <footer className="bg-background/50 border-t">
      <div className="py-8 lg:py-10">
        {/* Linha divisória e copyright */}
        <div className="mt-8pt-6">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <p className="text-muted-foreground text-xs">
              © {year} {companyInfo.name}. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
