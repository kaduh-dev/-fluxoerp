
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
  Download,
  Eye,
  FileText,
  Filter,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  Upload
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock data for Invoices
const invoicesMock = [
  {
    id: '1',
    number: '123456',
    issueDate: '2023-05-10',
    supplier: {
      name: 'Tech Solutions Inc.',
      document: '12.345.678/0001-90'
    },
    type: 'entrada', // entrada, saída
    value: 2450.75,
    status: 'confirmado', // pendente, confirmado, cancelado
    hasXml: true,
  },
  {
    id: '2',
    number: '654321',
    issueDate: '2023-05-08',
    supplier: {
      name: 'Office Supplies Co.',
      document: '98.765.432/0001-10'
    },
    type: 'saída',
    value: 1250.40,
    status: 'confirmado',
    hasXml: true,
  },
  {
    id: '3',
    number: '789012',
    issueDate: '2023-05-12',
    supplier: {
      name: 'Hardware Solutions',
      document: '45.678.901/0001-23'
    },
    type: 'entrada',
    value: 5670.00,
    status: 'pendente',
    hasXml: false,
  },
  {
    id: '4',
    number: '345678',
    issueDate: '2023-05-05',
    supplier: {
      name: 'Digital Computers',
      document: '56.789.012/0001-34'
    },
    type: 'entrada',
    value: 3200.85,
    status: 'cancelado',
    hasXml: true,
  },
  {
    id: '5',
    number: '901234',
    issueDate: '2023-05-11',
    supplier: {
      name: 'Network Systems Ltd.',
      document: '67.890.123/0001-45'
    },
    type: 'saída',
    value: 870.25,
    status: 'confirmado',
    hasXml: false,
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pendente':
      return <Badge className="bg-amber-500">Pendente</Badge>;
    case 'confirmado':
      return <Badge className="bg-green-500">Confirmado</Badge>;
    case 'cancelado':
      return <Badge variant="destructive">Cancelado</Badge>;
    default:
      return <Badge variant="outline">Desconhecido</Badge>;
  }
};

const getTypeBadge = (type: string) => {
  switch (type) {
    case 'entrada':
      return <Badge className="bg-blue-500">Entrada</Badge>;
    case 'saída':
      return <Badge className="bg-purple-500">Saída</Badge>;
    default:
      return <Badge variant="outline">Desconhecido</Badge>;
  }
};

const Invoices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [invoices, setInvoices] = useState(invoicesMock);

  // Filter invoices based on search term
  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.supplier.document.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Notas Fiscais">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Notas Fiscais</h2>
            <p className="text-muted-foreground">
              Gerencie e consulte notas fiscais de entrada e saída.
            </p>
          </div>
          <div className="flex gap-2">
            <Button>
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
            <Button variant="default">
              <Plus className="mr-2 h-4 w-4" />
              Nova Nota
            </Button>
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Importar XML
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por número, fornecedor, CNPJ..."
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
                  <TableHead>Fornecedor/Cliente</TableHead>
                  <TableHead>CNPJ/CPF</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Valor (R$)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data de emissão</TableHead>
                  <TableHead className="text-center">XML</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.number}</TableCell>
                    <TableCell>{invoice.supplier.name}</TableCell>
                    <TableCell>{invoice.supplier.document}</TableCell>
                    <TableCell>{getTypeBadge(invoice.type)}</TableCell>
                    <TableCell className="text-right">
                      {invoice.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell>{invoice.issueDate}</TableCell>
                    <TableCell className="text-center">
                      {invoice.hasXml ? (
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                          Sim
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                          Não
                        </Badge>
                      )}
                    </TableCell>
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
                          {invoice.hasXml && (
                            <DropdownMenuItem className="cursor-pointer">
                              <Download className="mr-2 h-4 w-4" />
                              <span>Baixar XML</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="cursor-pointer">
                            <FileText className="mr-2 h-4 w-4" />
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

                {filteredInvoices.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      Nenhuma nota fiscal encontrada.
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

export default Invoices;
