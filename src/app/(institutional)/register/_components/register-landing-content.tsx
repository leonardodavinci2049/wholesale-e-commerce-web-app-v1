import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RegisterFaq } from "./register-faq";
import { RegisterFinalCta } from "./register-final-cta";
import { RegisterForm } from "./register-form";
import { RegisterHero } from "./register-hero";
import { RegisterSteps } from "./register-steps";
import { RegisterTrustSection } from "./register-trust-section";
import { RegisterViewTracker } from "./register-view-tracker";
import { ResellerBenefits } from "./reseller-benefits";

interface SellerReferral {
  id: number;
  name: string;
}

interface RegisterLandingContentProps {
  sellerReferral?: SellerReferral;
  sellerReferralStatus?: "valid" | "invalid" | "unavailable";
}

export function RegisterLandingContent({
  sellerReferral,
  sellerReferralStatus = "valid",
}: RegisterLandingContentProps) {
  return (
    <main className="pb-10 sm:pb-14">
      <RegisterViewTracker />
      <RegisterHero />

      {/* Split layout: form (left, sticky) + value props (right) on desktop */}
      <section
        id="formulario"
        aria-labelledby="formulario-titulo"
        className="scroll-mt-24"
      >
        <h2 id="formulario-titulo" className="sr-only">
          Formulário de pré-cadastro
        </h2>
        <div className="container mx-auto max-w-7xl px-4 pt-3 pb-6 sm:px-6 sm:pt-4 sm:pb-8 lg:px-8 lg:pt-5 lg:pb-10">
          {/*
            Ordem no mobile (grid-cols-1): Formulário -> Passos -> Vantagens.
            No desktop, o formulário ocupa a coluna esquerda (sticky) e
            passos + vantagens ficam empilhados na coluna direita.
          */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7 lg:col-start-1 lg:row-span-2 lg:row-start-1">
              <div className="lg:sticky lg:top-20">
                {sellerReferralStatus === "valid" ? (
                  <RegisterForm
                    sellerId={sellerReferral?.id ?? 0}
                    sellerName={sellerReferral?.name}
                  />
                ) : (
                  <SellerReferralAlert status={sellerReferralStatus} />
                )}
              </div>
            </div>

            <div className="lg:col-span-5 lg:col-start-8 lg:row-start-1">
              <RegisterSteps />
            </div>

            <div className="lg:col-span-5 lg:col-start-8 lg:row-start-2">
              <ResellerBenefits />
            </div>
          </div>
        </div>
      </section>

      <RegisterFaq />
      <RegisterTrustSection />
      <RegisterFinalCta />
    </main>
  );
}

function SellerReferralAlert({
  status,
}: {
  status: "invalid" | "unavailable";
}) {
  const isInvalid = status === "invalid";

  return (
    <Alert variant="destructive" className="bg-card shadow-lg">
      <AlertCircle />
      <AlertTitle>
        {isInvalid ? "Indicação inválida" : "Validação indisponível"}
      </AlertTitle>
      <AlertDescription>
        {isInvalid
          ? "A indicação do Vendedor para cadastro não é válida."
          : "Não foi possível validar a indicação do vendedor agora. Tente novamente em instantes."}
      </AlertDescription>
    </Alert>
  );
}
