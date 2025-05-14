import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Product } from "../types";

interface ProductsTableProps {
  products: Product[];
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
}

export const ProductsTable = ({ products, onEdit, onRemove }: ProductsTableProps) => {
  const getStockStatus = (product: Product) => {
    // Define low stock as 5 or fewer items for this example
    const isLowStock = product.stock <= 5;
    return isLowStock ? 'low' : 'normal';
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead className="text-right">Preço</TableHead>
            <TableHead className="text-right">Estoque</TableHead>
            <TableHead className="text-right">Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                Nenhum produto encontrado
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.code}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(product.sale_price || 0)}
                </TableCell>
                <TableCell className="text-right">
                  {product.stock} {product.unit}
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant={getStockStatus(product) === 'low' ? 'destructive' : 'default'}>
                    {getStockStatus(product) === 'low' ? 'Baixo' : 'Normal'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(product.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onRemove(product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};