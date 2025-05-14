
import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Filter,
  Plus,
  Search,
} from 'lucide-react';
import { StockMovementWithProduct } from '@/types/inventory';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mock data for stock movements
const stockMovementsMock: StockMovementWithProduct[] = [
  {
    id: '1',
    product_id: '1',
    type: 'entry',
    quantity: 50,
    reason: 'Compra inicial',
    tenant_id: '1',
    created_at: '2023-05-10T10:30:00Z',
    product: {
      id: '1',
      name: 'Notebook Dell Inspiron',
      code: 'NOTE001',
      category: 'Eletrônicos',
      unit: 'unidade',
      sale_price: 4500,
      stock: 50,
      tenant_id: '1',
      created_at: '2023-05-01T00:00:00Z',
    }
  },
  {
    id: '2',
    product_id: '2',
    type: 'entry',
    quantity: 100,
    reason: 'Reposição de estoque',
    tenant_id: '1',
    created_at: '2023-05-11T14:20:00Z',
    product: {
      id: '2',
      name: 'Monitor LG 24"',
      code: 'MON002',
      category: 'Eletrônicos',
      unit: 'unidade',
      sale_price: 1200,
      stock: 75,
      tenant_id: '1',
      created_at: '2023-05-02T00:00:00Z',
    }
  },
  {
    id: '3',
    product_id: '1',
    type: 'exit',
    quantity: 5,
    reason: 'Venda',
    tenant_id: '1',
    created_at: '2023-05-12T09:45:00Z',
    product: {
      id: '1',
      name: 'Notebook Dell Inspiron',
      code: 'NOTE001',
      category: 'Eletrônicos',
      unit: 'unidade',
      sale_price: 4500,
      stock: 45,
      tenant_id: '1',
      created_at: '2023-05-01T00:00:00Z',
    }
  },
  {
    id: '4',
    product_id: '3',
    type: 'entry',
    quantity: 200,
    reason: 'Compra inicial',
    tenant_id: '1',
    created_at: '2023-05-13T11:05:00Z',
    product: {
      id: '3',
      name: 'Mouse Wireless Logitech',
      code: 'MOU003',
      category: 'Periféricos',
      unit: 'unidade',
      sale_price: 150,
      stock: 180,
      tenant_id: '1',
      created_at: '2023-05-03T00:00:00Z',
    }
  },
  {
    id: '5',
    product_id: '2',
    type: 'exit',
    quantity: 25,
    reason: 'Venda',
    tenant_id: '1',
    created_at: '2023-05-14T16:30:00Z',
    product: {
      id: '2',
      name: 'Monitor LG 24"',
      code: 'MON002',
      category: 'Eletrônicos',
      unit: 'unidade',
      sale_price: 1200,
      stock: 50,
      tenant_id: '1',
      created_at: '2023-05-02T00:00:00Z',
    }
  },
];

const StockMovements = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stockMovements, setStockMovements] = useState(stockMovementsMock);

  // Filter stock movements based on search term
  const filteredStockMovements = stockMovements.filter(
    (movement) =>
      movement.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Movimentações de Estoque">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Movimentações de Estoque</h2>
            <p className="text-muted-foreground">
              Gerencie e visualize todas as entradas e saídas de produtos do estoque.
            </p>
          </div>
          <div className="flex gap-2">
            <Button>
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
            <Button variant="default">
              <Plus className="mr-2 h-4 w-4" />
              Nova Movimentação
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por produto, código, motivo..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Histórico de Movimentações</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Quantidade</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStockMovements.map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell>{movement.product.name}</TableCell>
                    <TableCell>{movement.product.code}</TableCell>
                    <TableCell>
                      {movement.type === 'entry' ? (
                        <Badge className="bg-green-500 flex items-center gap-1 w-fit">
                          <ArrowDownCircle className="h-3.5 w-3.5" />
                          <span>Entrada</span>
                        </Badge>
                      ) : (
                        <Badge className="bg-rose-500 flex items-center gap-1 w-fit">
                          <ArrowUpCircle className="h-3.5 w-3.5" />
                          <span>Saída</span>
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {movement.quantity} {movement.product.unit}(s)
                    </TableCell>
                    <TableCell>{movement.reason}</TableCell>
                    <TableCell>
                      {format(new Date(movement.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </TableCell>
                  </TableRow>
                ))}

                {filteredStockMovements.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Nenhuma movimentação encontrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default StockMovements;
