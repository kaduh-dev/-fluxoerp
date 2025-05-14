
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Card,
  CardContent
} from '@/components/ui/card';
import {
  ArrowDown,
  ArrowUp,
  Edit,
  Filter,
  MoreVertical,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { FinancialEntry } from '@/types/financial';

// Mock data for financial entries
const financialEntriesMock: FinancialEntry[] = [
  {
    id: '1',
    description: 'Pagamento de aluguel',
    value: 2500,
    due_date: '2023-05-10',
    payment_date: '2023-05-09',
    status: 'paid',
    type: 'expense',
    category: 'Aluguel',
    tenant_id: '1',
    created_at: '2023-04-01',
  },
  {
    id: '2',
    description: 'Venda de serviços',
    value: 4500,
    due_date: '2023-05-15',
    payment_date: '2023-05-15',
    status: 'paid',
    type: 'income',
    category: 'Serviços',
    tenant_id: '1',
    created_at: '2023-04-02',
  },
  {
    id: '3',
    description: 'Conta de energia',
    value: 450.75,
    due_date: '2023-05-20',
    status: 'pending',
    type: 'expense',
    category: 'Utilidades',
    tenant_id: '1',
    created_at: '2023-04-10',
  },
  {
    id: '4',
    description: 'Manutenção de equipamentos',
    value: 850,
    due_date: '2023-05-22',
    status: 'pending',
    type: 'expense',
    category: 'Manutenção',
    tenant_id: '1',
    created_at: '2023-04-15',
  },
  {
    id: '5',
    description: 'Venda de produtos',
    value: 3200,
    due_date: '2023-05-25',
    status: 'pending',
    type: 'income',
    category: 'Vendas',
    tenant_id: '1',
    created_at: '2023-04-18',
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return <Badge className="bg-amber-500">Pendente</Badge>;
    case 'paid':
      return <Badge className="bg-green-500">Pago</Badge>;
    default:
      return <Badge variant="outline">Desconhecido</Badge>;
  }
};

const getTypeBadge = (type: string) => {
  switch (type) {
    case 'income':
      return (
        <div className="flex items-center">
          <ArrowUp className="w-4 h-4 text-green-600 mr-1" />
          <span className="text-green-600 font-medium">Receita</span>
        </div>
      );
    case 'expense':
      return (
        <div className="flex items-center">
          <ArrowDown className="w-4 h-4 text-red-600 mr-1" />
          <span className="text-red-600 font-medium">Despesa</span>
        </div>
      );
    default:
      return <span>Desconhecido</span>;
  }
};

const FinancialEntries = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [entries, setEntries] = useState(financialEntriesMock);

  // Filter entries based on search term
  const filteredEntries = entries.filter(
    (entry) =>
      entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Lançamentos Financeiros">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Lançamentos Financeiros</h2>
            <p className="text-muted-foreground">
              Gerencie os lançamentos financeiros, contas a pagar e a receber.
            </p>
          </div>
          <div className="flex gap-2">
            <Button>
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
            <Button variant="default">
              <Plus className="mr-2 h-4 w-4" />
              Novo Lançamento
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por descrição, categoria..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Valor (R$)</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.description}</TableCell>
                    <TableCell>{entry.category}</TableCell>
                    <TableCell>{getTypeBadge(entry.type)}</TableCell>
                    <TableCell className="text-right">
                      {entry.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>{entry.due_date}</TableCell>
                    <TableCell>{getStatusBadge(entry.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Editar</span>
                          </DropdownMenuItem>
                          {entry.status === 'pending' && (
                            <DropdownMenuItem className="cursor-pointer">
                              <ArrowDown className="mr-2 h-4 w-4" />
                              <span>Marcar como pago</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="cursor-pointer text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Excluir</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredEntries.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Nenhum lançamento encontrado.
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

export default FinancialEntries;
