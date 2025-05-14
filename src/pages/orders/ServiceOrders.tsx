
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
  CalendarDays,
  Edit,
  Eye,
  FileType2,
  Filter,
  MoreVertical,
  Plus,
  Search,
  Trash2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock data for Service Orders
const serviceOrdersMock = [
  {
    id: '1',
    number: 'OS0001',
    client: 'Empresa ABC Ltda',
    responsible: 'Carlos Mendes',
    description: 'Manutenção em servidor principal',
    status: 'completed', // pending, in_progress, completed, cancelled
    createdAt: '2023-05-10',
    updatedAt: '2023-05-15',
  },
  {
    id: '2',
    number: 'OS0002',
    client: 'Loja XYZ Comércio',
    responsible: 'Ana Souza',
    description: 'Instalação de rede wireless',
    status: 'in_progress',
    createdAt: '2023-05-12',
    updatedAt: '2023-05-12',
  },
  {
    id: '3',
    number: 'OS0003',
    client: 'Restaurante Sabor & Arte',
    responsible: 'Paulo Silva',
    description: 'Manutenção em impressora fiscal',
    status: 'pending',
    createdAt: '2023-05-14',
    updatedAt: '2023-05-14',
  },
  {
    id: '4',
    number: 'OS0004',
    client: 'Clínica Saúde Total',
    responsible: 'Roberto Alves',
    description: 'Suporte para sistema de agendamento',
    status: 'cancelled',
    createdAt: '2023-05-09',
    updatedAt: '2023-05-11',
  },
  {
    id: '5',
    number: 'OS0005',
    client: 'Consultoria Visão',
    responsible: 'Carlos Mendes',
    description: 'Atualização de software ERP',
    status: 'completed',
    createdAt: '2023-05-05',
    updatedAt: '2023-05-08',
  },
  {
    id: '6',
    number: 'OS0006',
    client: 'Auto Peças Rápidas',
    responsible: 'Juliana Costa',
    description: 'Instalação de sistema de controle de estoque',
    status: 'in_progress',
    createdAt: '2023-05-13',
    updatedAt: '2023-05-13',
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return <Badge className="bg-amber-500">Pendente</Badge>;
    case 'in_progress':
      return <Badge className="bg-blue-500">Em andamento</Badge>;
    case 'completed':
      return <Badge className="bg-green-500">Concluído</Badge>;
    case 'cancelled':
      return <Badge variant="destructive">Cancelado</Badge>;
    default:
      return <Badge variant="outline">Desconhecido</Badge>;
  }
};

const ServiceOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceOrders, setServiceOrders] = useState(serviceOrdersMock);

  // Filter service orders based on search term
  const filteredServiceOrders = serviceOrders.filter(
    (order) =>
      order.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.responsible.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Ordens de Serviço">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Ordens de Serviço</h2>
            <p className="text-muted-foreground">
              Gerencie os serviços prestados, acompanhe o status e veja o histórico.
            </p>
          </div>
          <div className="flex gap-2">
            <Button>
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
            <Button variant="default">
              <Plus className="mr-2 h-4 w-4" />
              Nova OS
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por número, cliente, responsável..."
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
                  <TableHead className="w-[100px]">Número</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead className="max-w-[300px]">Descrição</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data de criação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServiceOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.number}</TableCell>
                    <TableCell>{order.client}</TableCell>
                    <TableCell>{order.responsible}</TableCell>
                    <TableCell className="max-w-[300px] truncate">{order.description}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{order.createdAt}</TableCell>
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
                          <DropdownMenuItem className="cursor-pointer">
                            <FileType2 className="mr-2 h-4 w-4" />
                            <span>Gerar PDF</span>
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

                {filteredServiceOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Nenhuma ordem de serviço encontrada.
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

export default ServiceOrders;
