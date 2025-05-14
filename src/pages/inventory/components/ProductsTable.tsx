
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product } from "../types";

interface ProductsTableProps {
  products: Product[];
}

export const ProductsTable = ({ products }: ProductsTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">SKU</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead className="text-center">Quantidade</TableHead>
            <TableHead className="text-center">Mín. Estoque</TableHead>
            <TableHead className="text-center">Local</TableHead>
            <TableHead className="text-right">Preço</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length > 0 ? (
            products.map((product) => (
              <TableRow key={product.id} className="cursor-pointer hover:bg-muted/60">
                <TableCell className="font-medium">{product.sku}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell className="text-center">{product.quantity}</TableCell>
                <TableCell className="text-center">{product.minStock}</TableCell>
                <TableCell className="text-center">{product.location}</TableCell>
                <TableCell className="text-right">
                  R$ {product.price.toFixed(2).replace(".", ",")}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={
                      product.status === "out" 
                        ? "destructive" 
                        : product.status === "low" 
                          ? "outline" 
                          : "secondary"
                    }
                    className={
                      product.status === "low"
                        ? "bg-amber-100 text-amber-600 hover:bg-amber-200 hover:text-amber-700"
                        : product.status === "normal"
                        ? "bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700" 
                        : ""
                    }
                  >
                    {product.status === "normal"
                      ? "Normal"
                      : product.status === "low"
                      ? "Baixo"
                      : "Esgotado"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                Nenhum produto encontrado com os filtros selecionados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
