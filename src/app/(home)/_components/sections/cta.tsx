import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="bg-linear-to-r from-green-600 to-blue-600 py-16 text-white sm:py-20">
      <div className="container mx-auto w-full max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl lg:text-4xl">
          Pronto para começar a revender?
        </h2>
        <p className="mx-auto mb-6 max-w-2xl text-base opacity-90 sm:mb-8 sm:text-lg lg:text-xl">
          Cadastre-se agora e tenha acesso ao nosso catálogo exclusivo com
          preços para atacado e varejo
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
          <Link href="/contact" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="secondary"
              className="h-12 w-full px-6 text-base sm:w-auto sm:px-8 sm:text-lg cursor-pointer"
            >
              Cadastrar-se Gratuitamente
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
          <Link href="/contact" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="h-12 w-full border-white bg-transparent px-6 text-base text-white hover:bg-white hover:text-green-600 sm:w-auto sm:px-8 sm:text-lg cursor-pointer"
            >
              Falar com Consultor
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
