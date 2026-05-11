import Image from "next/image";
import { Card } from "@/components/ui/card";
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
    <div className="flex items-center justify-center p-4">
      {/* Card para telas grandes com formulário e imagem */}
      <Card className="bg-card/50 hidden w-full max-w-5xl overflow-hidden border-0 shadow-2xl backdrop-blur-sm lg:grid lg:h-[600px] lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-sm">
              <LoginForm accessDeniedMessage={accessDeniedMessage} />
            </div>
          </div>
        </div>
        <div className="relative flex items-center justify-center">
          <Image
            src="/images/auth/logo-winerp-banner-auth.png"
            alt="Dashboard Background"
            fill
            sizes="(min-width: 1280px) 512px, (min-width: 1024px) calc(50vw - 2rem), 0px"
            className="object-contain object-center"
            priority
          />
        </div>
      </Card>

      {/* Formulário simples para telas menores */}
      <div className="w-full max-w-sm lg:hidden">
        <LoginForm accessDeniedMessage={accessDeniedMessage} />
      </div>
    </div>
  );
}
