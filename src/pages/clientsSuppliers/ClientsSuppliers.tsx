import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useToast } from '@/hooks/use-toast';
import { useTenant } from '@/contexts/TenantContext';
import { supabase } from '@/lib/supabase';
import { ClientSupplier } from '@/types/clientSupplier';
import { ClientsSuppliersList } from './components/ClientsSuppliersList';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { ClientSupplierForm } from './components/ClientSupplierForm';

const ClientsSuppliers = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ClientSupplier | null>(null);
  const { toast } = useToast();
  const { currentTenant } = useTenant();

  const {
    data: clientsSuppliers = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['clientsSuppliers', currentTenant?.id],
    queryFn: async () => {
      if (!currentTenant?.id) return [];

      const { data, error } = await supabase
        .from('clients_suppliers')
        .select('*')
        .eq('tenant_id', currentTenant.id)
        .order('name', { ascending: true });

      if (error) {
        toast({
          title: 'Erro ao carregar dados',
          description: error.message,
          variant: 'destructive',
        });
        return [];
      }

      return data as ClientSupplier[];
    },
    enabled: !!currentTenant?.id,
  });

  const handleEdit = (item: ClientSupplier) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!currentTenant?.id) return;

    const { error } = await supabase
      .from('clients_suppliers')
      .delete()
      .eq('id', id)
      .eq('tenant_id', currentTenant.id);

    if (error) {
      toast({
        title: 'Erro ao excluir',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Registro excluído',
      description: 'O registro foi removido com sucesso.',
    });

    refetch();
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingItem(null);
    refetch();
  };

  return (
    <Layout title="Clientes e Fornecedores">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Clientes e Fornecedores</h2>
            <p className="text-muted-foreground">Gerencie seus clientes e fornecedores</p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Registro
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Carregando...</span>
          </div>
        ) : clientsSuppliers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-muted/10">
            <p className="text-muted-foreground mb-4">Nenhum registro encontrado</p>
            <Button onClick={() => setIsFormOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Primeiro Registro
            </Button>
          </div>
        ) : (
          <ClientsSuppliersList 
            items={clientsSuppliers}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <ClientSupplierForm 
              initialData={editingItem}
              onSuccess={handleFormSuccess}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingItem(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default ClientsSuppliers;