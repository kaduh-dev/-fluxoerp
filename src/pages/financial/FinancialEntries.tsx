import { useState } from 'react';
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Filter, Plus, Download, Search } from "lucide-react";

// Mock data for financial entries
const financialEntriesMock = [
  {
    id: 1,
    description: "Pagamento de fornecedor",
    category: "Despesa",
    amount: -1250.0,
    date: "2023-05-15",
    status: "Pago",
    dueDate: "2023-05-15",
    paymentMethod: "Transferência"
  },
  {
    id: 2,
    description: "Venda de produtos",
    category: "Receita",
    amount: 3500.0,
    date: "2023-05-16",
    status: "Recebido",
    dueDate: "2023-05-16",
    paymentMethod: "Cartão de Crédito"
  },
  {
    id: 3,
    description: "Aluguel do escritório",
    category: "Despesa",
    amount: -2000.0,
    date: "2023-05-20",
    status: "Pendente",
    dueDate: "2023-05-20",
    paymentMethod: "Boleto"
  },
  {
    id: 4,
    description: "Serviço de consultoria",
    category: "Receita",
    amount: 1800.0,
    date: "2023-05-25",
    status: "Pendente",
    dueDate: "2023-05-30",
    paymentMethod: "Transferência"
  },
  {
    id: 5,
    description: "Pagamento de energia",
    category: "Despesa",
    amount: -450.0,
    date: "2023-05-10",
    status: "Pago",
    dueDate: "2023-05-10",
    paymentMethod: "Débito Automático"
  }
];

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

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Lançamentos</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar lançamentos..."
                    className="pl-8 w-[250px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Método</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell>{entry.category}</TableCell>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell>{entry.dueDate}</TableCell>
                    <TableCell className={entry.amount >= 0 ? "text-green-600" : "text-red-600"}>
                      {entry.amount.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        entry.status === "Pago" || entry.status === "Recebido" 
                          ? "success" 
                          : entry.status === "Pendente" 
                            ? "warning" 
                            : "default"
                      }>
                        {entry.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{entry.paymentMethod}</TableCell>
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