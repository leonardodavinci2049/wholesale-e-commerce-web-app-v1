import { Calendar, Package, Star, Users } from "lucide-react";

const STATS_DATA = [
  {
    icon: Package,
    value: "5000+",
    label: "Produtos Disponíveis",
    color: "blue",
  },
  {
    icon: Users,
    value: "20000+",
    label: "Clientes Satisfeitos",
    color: "green",
  },
  {
    icon: Calendar,
    value: "25+",
    label: "Anos de Experiência",
    color: "yellow",
  },
  {
    icon: Star,
    value: "4.9/5",
    label: "Avaliação dos Clientes",
    color: "purple",
  },
] as const;

export function StatsSection() {
  return (
    <section className="py-12 sm:py-16 bg-muted/50">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {STATS_DATA.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900/20 mb-3 sm:mb-4`}
                >
                  <Icon
                    className={`h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-${stat.color}-600`}
                  />
                </div>
                <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
