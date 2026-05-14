import { Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UIProductPdv } from "@/services/api-main/product-pdv/transformers/transformers";
import { formatCurrency } from "@/utils/common-utils";

interface ProductViewPricingProps {
  product: UIProductPdv;
}

export function ProductViewPricing({ product }: ProductViewPricingProps) {
  return (
    <Card className="bg-slate-50/50 dark:bg-slate-900/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Tag className="w-5 h-5" /> Preços
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">Atacado</span>
          <span className="text-3xl font-bold text-primary">
            {formatCurrency(Number(product.wholesalePrice) || 0)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
