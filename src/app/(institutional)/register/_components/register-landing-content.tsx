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
    <main className="pb-16">
      <RegisterViewTracker />
      <RegisterHero />
      <RegisterSteps />

      <section
        id="formulario"
        aria-labelledby="formulario-titulo"
        className="scroll-mt-24 bg-muted/40 py-12 sm:py-16 lg:py-20"
      >
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 id="formulario-titulo" className="sr-only">
            Formulário de pré-cadastro
          </h2>
          <RegisterForm />
        </div>
      </section>

      <RegisterTrustSection />
      <RegisterFaq />
      <RegisterFinalCta />
    </main>
  );
}
