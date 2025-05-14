
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ExportOptions } from "@/components/inventory/ExportOptions";
import { toast } from "@/components/ui/sonner";
import { Product } from "../types";
import { Activity } from "@/types/activity";

interface ProductActionsProps {
  filteredProducts: Product[];
  totalProducts: number;
  onAddProduct: () => void;
}

export const ProductActions = ({ 
  filteredProducts, 
  totalProducts, 
  onAddProduct 
}: ProductActionsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 justify-between">
      <div className="text-sm text-muted-foreground">
        Mostrando {filteredProducts.length} de {totalProducts} produtos
      </div>
      <div className="flex gap-2">
        <ExportOptions data={filteredProducts} filename="inventario" />
        <Button onClick={onAddProduct}>
          <Plus className="mr-2 h-4 w-4" /> Novo Produto
        </Button>
      </div>
    </div>
  );
};
