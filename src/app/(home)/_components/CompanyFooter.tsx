import Link from "next/link";
import { companyInfo } from "@/data/info-company";
import { getCurrentYear } from "@/lib/current-time";

export default async function CompanyFooter() {
  const currentYear = await getCurrentYear();

  return (
    <footer className="bg-background/50 border-t py-8">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <h4 className="font-semibold">{companyInfo.name}</h4>
            <p className="text-muted-foreground text-sm">{companyInfo.email}</p>
            <p className="text-muted-foreground text-sm">{companyInfo.phone}</p>
          </div>

          <div>
            <h5 className="font-medium">Empresa</h5>
            <ul className="mt-2 space-y-1 text-sm">
              <li>
                <Link href="/about">Sobre</Link>
              </li>
              <li>
                <Link href="/privacy">Privacidade</Link>
              </li>
              <li>
                <Link href="/terms">Termos</Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-medium">Ajuda</h5>
            <ul className="mt-2 space-y-1 text-sm">
              <li>
                <Link href="/contact">Contato</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 mt-6">
        <div className="text-muted-foreground text-center text-sm">
          © {currentYear} {companyInfo.name}. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
