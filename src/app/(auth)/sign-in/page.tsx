import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { LoginForm } from "./LoginForm";

type LoginPageSearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

export default function LoginPage({
  searchParams,
}: {
  searchParams: LoginPageSearchParams;
}) {
  return (
    <div className="flex w-full items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <Suspense fallback={<Spinner />}>
          <LoginPageContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

async function LoginPageContent({
  searchParams,
}: {
  searchParams: LoginPageSearchParams;
}) {
  const resolvedSearchParams = await searchParams;
  const accessDeniedMessage =
    resolvedSearchParams.reason === "access-denied"
      ? "Você não tem permissão para acessar o sistema contacte o administrador"
      : undefined;

  return <LoginForm accessDeniedMessage={accessDeniedMessage} />;
}
