import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import RegistrationSuccessContent from "./RegistrationSuccessContent";

type RegistrationSuccessSearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

async function RegistrationSuccessRouteContent({
  searchParams,
}: {
  searchParams: RegistrationSuccessSearchParams;
}) {
  // Verificar se usuário está autenticado através dos cookies
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("better-auth.session_token");

  // Se usuário está logado, redirecionar para dashboard
  if (sessionCookie?.value) {
    redirect("/dashboard");
  }

  const resolvedSearchParams = await searchParams;

  // Verificar se veio do registro (parâmetro success=true)
  const isFromRegistration = resolvedSearchParams.success === "true";
  const email =
    typeof resolvedSearchParams.email === "string"
      ? resolvedSearchParams.email
      : undefined;
  const reason =
    resolvedSearchParams.reason === "email-not-verified"
      ? "email-not-verified"
      : undefined;

  // Se não veio do registro, redirecionar para login
  if (!isFromRegistration) {
    redirect("/sign-in");
  }

  return <RegistrationSuccessContent email={email} reason={reason} />;
}

/**
 * Verification guidance page shown after a successful sign-up
 *
 * Validações:
 * 1. Se usuário está logado, redireciona para dashboard
 * 2. Se não veio do registro (sem flag de sucesso), redireciona para login
 * 3. Exibe instruções para verificar o email cadastrado
 */
export default async function RegistrationSuccessPage({
  searchParams,
}: {
  searchParams: RegistrationSuccessSearchParams;
}) {
  return (
    <Suspense fallback={<RegistrationSuccessContent />}>
      <RegistrationSuccessRouteContent searchParams={searchParams} />
    </Suspense>
  );
}
