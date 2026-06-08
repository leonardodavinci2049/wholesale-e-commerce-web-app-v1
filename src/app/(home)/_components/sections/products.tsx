import { Headphones, Laptop, Smartphone } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const PRODUCTS_DATA = [
  {
    icon: Laptop,
    link: "/category/linha-celular",
    title: "Informática",
    description:
      "Notebooks, desktops, periféricos e acessórios das melhores marcas",
    color: "blue",
  },
  {
    icon: Smartphone,

    link: "category/informatica-eletronico",
    title: "Eletrônicos",
    description: "Smartphones, tablets, smartwatches e gadgets tecnológicos",
    color: "green",
  },
  {
    icon: Headphones,
    link: "/category/perfumaria-e-beleza",
    title: "Perfumes",
    description:
      "Perfumes importados originais das melhores marcas internacionais",
    color: "purple",
  },
] as const;

export function ProductsSection() {
  return (
    <section id="produtos" className="py-16 sm:py-20">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center sm:mb-16">
          <h2 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl lg:text-4xl">
            Nossas Categorias de Produtos
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl px-4 text-lg sm:px-0 sm:text-xl">
            Oferecemos uma ampla gama de produtos com qualidade garantida e
            preços competitivos
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
          {PRODUCTS_DATA.map((product) => {
            const Icon = product.icon;
            return (
              <Card
                key={product.title}
                className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <CardContent className="p-6 text-center sm:p-8">
                  <div
                    className={`inline-flex h-14 w-14 items-center justify-center rounded-full sm:h-16 sm:w-16 bg-${product.color}-100 dark:bg-${product.color}-900/20 mb-4 transition-transform group-hover:scale-110 sm:mb-6`}
                  >
                    <Icon
                      className={`h-7 w-7 sm:h-8 sm:w-8 text-${product.color}-600`}
                    />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold sm:mb-4 sm:text-xl">
                    {product.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm sm:mb-6 sm:text-base">
                    {product.description}
                  </p>
                  <Link href={product.link} className="w-full">
                    <Button
                      variant="outline"
                      className="w-full bg-transparent cursor-pointer"
                    >
                      Ver Produtos
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
