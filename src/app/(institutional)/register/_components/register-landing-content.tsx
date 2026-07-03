import { RegisterFaq } from "./register-faq";
import { RegisterFinalCta } from "./register-final-cta";
import { RegisterForm } from "./register-form";
import { RegisterHero } from "./register-hero";
import { RegisterSteps } from "./register-steps";
import { RegisterTrustSection } from "./register-trust-section";
import { RegisterViewTracker } from "./register-view-tracker";
import { ResellerBenefits } from "./reseller-benefits";

export function RegisterLandingContent() {
  return (
    <main className="pb-10 sm:pb-14">
      <RegisterViewTracker />
      <RegisterHero />

      {/* Split layout: value props (left) + form (right, sticky on desktop) */}
      <section
        id="formulario"
        aria-labelledby="formulario-titulo"
        className="scroll-mt-24"
      >
        <h2 id="formulario-titulo" className="sr-only">
          Formulário de pré-cadastro
        </h2>
        <div className="container mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          {/*
            Ordem no mobile (grid-cols-1): Passos -> Formulário -> Vantagens,
            para o usuário chegar ao formulário com menos scroll.
            No desktop, o formulário ocupa a coluna direita (sticky) e
            passos + vantagens ficam empilhados na coluna esquerda.
          */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5 lg:col-start-1 lg:row-start-1">
              <RegisterSteps />
            </div>

            <div className="lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
              <div className="lg:sticky lg:top-20">
                <RegisterForm />
              </div>
            </div>

            <div className="lg:col-span-5 lg:col-start-1 lg:row-start-2">
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
