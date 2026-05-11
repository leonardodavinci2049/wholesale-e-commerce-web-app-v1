import { LoginForm } from "./LoginForm";

type LoginPageSearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: LoginPageSearchParams;
}) {
  const resolvedSearchParams = await searchParams;
  const accessDeniedMessage =
    resolvedSearchParams.reason === "access-denied"
      ? "Você não tem permissão para acessar o sistema contacte o administrador"
      : undefined;

  return (
    <div className="flex w-full items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <LoginForm accessDeniedMessage={accessDeniedMessage} />
      </div>
    </div>
  );
}
