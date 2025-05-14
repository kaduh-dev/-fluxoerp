
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
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  BarChart3,
  Download,
  Edit,
  Eye,
  Filter,
  MoreVertical,
  Plus,
  Search,
  Trash2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

// Mock data for Expenses
const expensesMock = [
  {
    id: '1',
    description: 'Compra de material de escritório',
    category: 'compra',
    supplier: 'Office Supplies Co.',
    date: '2023-05-10',
    value: 450.75,
    paymentMethod: 'pix',
    status: 'pago', // pago, pendente, atrasado
  },
  {
    id: '2',
    description: 'Manutenção de ar condicionado',
    category: 'manutenção',
    supplier: 'Clima Perfeito Ltda.',
    date: '2023-05-12',
    value: 850.00,
    paymentMethod: 'cartão',
    status: 'pendente',
  },
  {
    id: '3',
    description: 'Licença de software ERP',
    category: 'serviço',
    supplier: 'Software Solutions S.A.',
    date: '2023-05-08',
    value: 2500.00,
    paymentMethod: 'transferência',
    status: 'pago',
  },
  {
    id: '4',
    description: 'Conta de energia elétrica',
    category: 'utilidade',
    supplier: 'Energia Luz S.A.',
    date: '2023-05-05',
    value: 1250.40,
    paymentMethod: 'boleto',
    status: 'atrasado',
  },
  {
    id: '5',
    description: 'Compra de equipamentos de informática',
    category: 'compra',
    supplier: 'Tech Store Inc.',
    date: '2023-05-15',
    value: 5670.30,
    paymentMethod: 'cartão',
    status: 'pendente',
  },
  {
    id: '6',
    description: 'Serviço de consultoria financeira',
    category: 'serviço',
    supplier: 'Consultoria Financeira Ltda.',
    date: '2023-05-03',
    value: 3200.00,
    paymentMethod: 'transferência',
    status: 'pago',
  },
];

// Chart data
const expensesByCategory = [
  { name: 'Compras', value: 6121.05 },
  { name: 'Manutenção', value: 850.00 },
  { name: 'Serviços', value: 5700.00 },
  { name: 'Utilidades', value: 1250.40 },
];

const expensesByMonth = [
  { name: 'Jan', value: 8500 },
  { name: 'Fev', value: 7200 },
  { name: 'Mar', value: 9500 },
  { name: 'Abr', value: 10200 },
  { name: 'Mai', value: 13921.45 },
];

// Colors for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pago':
      return <Badge className="bg-green-500">Pago</Badge>;
    case 'pendente':
      return <Badge className="bg-amber-500">Pendente</Badge>;
    case 'atrasado':
      return <Badge variant="destructive">Atrasado</Badge>;
    default:
      return <Badge variant="outline">Desconhecido</Badge>;
  }
};

const getCategoryBadge = (category: string) => {
  switch (category) {
    case 'compra':
      return <Badge className="bg-blue-500">Compra</Badge>;
    case 'manutenção':
      return <Badge className="bg-orange-500">Manutenção</Badge>;
    case 'serviço':
      return <Badge className="bg-purple-500">Serviço</Badge>;
    case 'utilidade':
      return <Badge className="bg-teal-500">Utilidade</Badge>;
    default:
      return <Badge variant="outline">Outro</Badge>;
  }
};

const Expenses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expenses, setExpenses] = useState(expensesMock);

  // Filter expenses based on search term
  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.value, 0);

  return (
    <Layout title="Financeiro">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Controle de Gastos</h2>
            <p className="text-muted-foreground">
              Gerencie despesas, categorias e acompanhe o fluxo financeiro.
            </p>
          </div>
          <div className="flex gap-2">
            <Button>
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
            <Button variant="default">
              <Plus className="mr-2 h-4 w-4" />
              Nova Despesa
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Despesas por Categoria</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expensesByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {expensesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Histórico Mensal</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={expensesByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                    <Bar dataKey="value" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Resumo Financeiro</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total de despesas (mês):</span>
                  <span className="text-xl font-semibold">
                    R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Despesas pagas:</span>
                  <span className="text-green-500 font-medium">
                    R$ {expenses.filter(e => e.status === 'pago')
                      .reduce((sum, e) => sum + e.value, 0)
                      .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Despesas pendentes:</span>
                  <span className="text-amber-500 font-medium">
                    R$ {expenses.filter(e => e.status === 'pendente')
                      .reduce((sum, e) => sum + e.value, 0)
                      .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Despesas atrasadas:</span>
                  <span className="text-red-500 font-medium">
                    R$ {expenses.filter(e => e.status === 'atrasado')
                      .reduce((sum, e) => sum + e.value, 0)
                      .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
              <Button className="w-full mt-6" variant="outline">
                <BarChart3 className="mr-2 h-4 w-4" />
                Ver relatório completo
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por descrição, categoria, fornecedor..."
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
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Forma de Pagamento</TableHead>
                  <TableHead className="text-right">Valor (R$)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">{expense.description}</TableCell>
                    <TableCell>{getCategoryBadge(expense.category)}</TableCell>
                    <TableCell>{expense.supplier}</TableCell>
                    <TableCell>{expense.date}</TableCell>
                    <TableCell className="capitalize">{expense.paymentMethod}</TableCell>
                    <TableCell className="text-right">
                      {expense.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>{getStatusBadge(expense.status)}</TableCell>
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
                            <Eye className="mr-2 h-4 w-4" />
                            <span>Visualizar</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Editar</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Excluir</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredExpenses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Nenhuma despesa encontrada.
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

export default Expenses;
