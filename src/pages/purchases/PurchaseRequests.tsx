
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
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
  Check,
  Edit,
  Eye,
  Filter,
  MoreVertical,
  PackageOpen,
  Plus,
  Search,
  Trash2,
  X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { PurchaseRequestWithSupplier } from '@/types/purchase';
import { ClientSupplier } from '@/types/clientSupplier';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { NewPurchaseRequestForm } from './components/NewPurchaseRequestForm';
import { useToast } from '@/hooks/use-toast';

const PurchaseRequests = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  const fetchPurchaseRequests = async () => {
    if (!currentTenant?.id) {
      console.error('No tenant ID available');
      toast({
        title: 'Erro',
        description: 'Tenant não disponível',
        variant: 'destructive',
      });
      return [];
    }

    try {
      // Fetch purchase requests
      const { data: purchaseData, error: purchaseError } = await supabase
        .from('purchase_requests')
        .select('*')
        .eq('tenant_id', currentTenant.id)
        .order('requestDate', { ascending: false });

      if (purchaseError) {
        console.error('Error fetching purchase requests:', purchaseError);
        toast({
          title: 'Erro ao carregar pedidos',
          description: purchaseError.message,
          variant: 'destructive',
        });
        return [];
      }

      // Now fetch suppliers for all purchase requests that have a supplier_id
      const supplierIds = purchaseData
        ?.filter(pr => pr.supplier_id)
        .map(pr => pr.supplier_id) || [];

      let supplierData: ClientSupplier[] = [];

      if (supplierIds.length > 0) {
        const { data, error } = await supabase
          .from('clients_suppliers')
          .select('*')
          .in('id', supplierIds);

        if (error) {
          console.error('Error fetching suppliers:', error);
        } else if (data) {
          supplierData = data;
        }
      }

      // Map suppliers to purchase requests
      const purchasesWithSuppliers = (purchaseData || []).map(pr => {
        const supplier = supplierData.find(s => s.id === pr.supplier_id) || null;
        return {
          ...pr,
          supplier
        } as PurchaseRequestWithSupplier;
      });

      return purchasesWithSuppliers;
    } catch (error) {
      console.error('Error in fetchPurchaseRequests:', error);
      return [];
    }
  };

  const { data: purchaseRequests = [], refetch } = useQuery({
    queryKey: ['purchaseRequests'],
    queryFn: fetchPurchaseRequests
  });

  // Filter purchase requests based on search term
  const filteredPurchaseRequests = purchaseRequests.filter(
    (request) =>
      request.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requester.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.supplier?.name && request.supplier.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (request.approver && request.approver.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-500">Pendente</Badge>;
      case 'approved':
        return <Badge className="bg-blue-500">Aprovado</Badge>;
      case 'delivered':
        return <Badge className="bg-green-500">Entregue</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejeitado</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    refetch();
  };

  return (
    <Layout title="Compras">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Pedidos de Compra</h2>
            <p className="text-muted-foreground">
              Gerencie solicitações, aprovações e acompanhe o status das compras.
            </p>
          </div>
          <div className="flex gap-2">
            <Button>
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
            <Button variant="default" onClick={() => setIsFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Pedido
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por número, solicitante, fornecedor..."
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
                  <TableHead>Solicitante</TableHead>
                  <TableHead>Aprovador</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead className="text-center">Itens</TableHead>
                  <TableHead className="text-right">Total (R$)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPurchaseRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.number}</TableCell>
                    <TableCell>{request.requester}</TableCell>
                    <TableCell>{request.approver}</TableCell>
                    <TableCell>{request.supplier ? request.supplier.name : '-'}</TableCell>
                    <TableCell className="text-center">{request.items}</TableCell>
                    <TableCell className="text-right">
                      {request.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>{request.requestDate}</TableCell>
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
                          {request.status === 'pending' && (
                            <>
                              <DropdownMenuItem className="cursor-pointer">
                                <Check className="mr-2 h-4 w-4 text-green-500" />
                                <span>Aprovar</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">
                                <X className="mr-2 h-4 w-4 text-red-500" />
                                <span>Rejeitar</span>
                              </DropdownMenuItem>
                            </>
                          )}
                          {request.status === 'approved' && (
                            <DropdownMenuItem className="cursor-pointer">
                              <PackageOpen className="mr-2 h-4 w-4" />
                              <span>Registrar entrega</span>
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

                {filteredPurchaseRequests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      Nenhum pedido de compra encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <NewPurchaseRequestForm 
            onSuccess={handleFormSuccess}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default PurchaseRequests;
