
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package2 } from "lucide-react";
import { Product } from "../types";

interface SummaryCardsProps {
  products: Product[];
}

export const SummaryCards = ({ products }: SummaryCardsProps) => {
  // Calculate total inventory value
  const totalInventoryValue = products.reduce((acc, p) => {
    const price = p.sale_price || 0;
    const quantity = p.stock || 0;
    return acc + (price * quantity);
  }, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Total de Produtos</CardTitle>
          <Package2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{products.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Estoque Baixo</CardTitle>
          <Package2 className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {products.filter((p) => p.status === "low").length}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Sem Estoque</CardTitle>
          <Package2 className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {products.filter((p) => p.status === "out").length}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Valor do Estoque</CardTitle>
          <Package2 className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            R$ {totalInventoryValue.toFixed(2).replace(".", ",")}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
