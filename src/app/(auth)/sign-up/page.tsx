// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";
// import { redirect } from "next/navigation";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

import RegisterForm from "./RegisterForm";

const RegisterPage = async () => {
  /*   const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    return redirect("/dashboard");
  }
 */
  return (
    <div className="w-full max-w-sm">
      <Card className="mt-12 w-full rounded-2xl">
        <CardHeader>
          <h2 className="text-xl font-bold">Cadastre-se</h2>
          <CardDescription>Faça seu cadastro gratuitamente.</CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
      <p className="text-muted-foreground mt-3 text-center text-sm">
        Já possui cadastro?{" "}
        <Link className="text-gray-800 hover:underline" href="/sign-in">
          Faça o login
        </Link>
        .
      </p>
    </div>
  );
};

export default RegisterPage;
