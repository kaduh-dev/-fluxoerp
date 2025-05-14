
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { ClientSupplier } from '@/types/clientSupplier';
import { useTenant } from '@/contexts/TenantContext';
import { useToast } from '@/hooks/use-toast';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

// Define the form schema with validation
const formSchema = z.object({
  number: z.string().min(1, 'Número é obrigatório'),
  requester: z.string().min(1, 'Solicitante é obrigatório'),
  supplier_id: z.string().min(1, 'Fornecedor é obrigatório'),
  items: z.coerce.number().min(1, 'Deve ter pelo menos 1 item'),
  total: z.coerce.number().min(0, 'Total não pode ser negativo'),
  status: z.string().default('pending'),
  requestDate: z.string().min(1, 'Data é obrigatória'),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface NewPurchaseRequestFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const NewPurchaseRequestForm = ({
  onSuccess,
  onCancel,
}: NewPurchaseRequestFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<ClientSupplier[]>([]);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(true);
  const { toast } = useToast();
  const { currentTenant } = useTenant();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: `PC${String(Date.now()).slice(-6)}`, // Gera um número baseado no timestamp
      requester: '',
      supplier_id: '',
      items: 1,
      total: 0,
      status: 'pending',
      requestDate: new Date().toISOString().split('T')[0], // Data atual no formato YYYY-MM-DD
      description: '',
    },
  });

  useEffect(() => {
    const fetchSuppliers = async () => {
      if (!currentTenant) return;

      try {
        setIsLoadingSuppliers(true);
        const { data, error } = await supabase
          .from('clients_suppliers')
          .select('*')
          .eq('tenant_id', currentTenant.id)
          .in('type', ['supplier', 'both'])
          .eq('status', 'active')
          .order('name');

        if (error) {
          console.error('Error fetching suppliers:', error);
          toast({
            title: 'Erro ao buscar fornecedores',
            description: error.message,
            variant: 'destructive',
          });
        } else if (data) {
          setSuppliers(data);
        }
      } catch (error: any) {
        console.error('Exception fetching suppliers:', error);
        toast({
          title: 'Erro',
          description: error.message || 'Ocorreu um erro ao buscar fornecedores.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingSuppliers(false);
      }
    };

    fetchSuppliers();
  }, [currentTenant, toast]);

  const onSubmit = async (data: FormData) => {
    if (!currentTenant) {
      toast({
        title: 'Erro',
        description: 'Tenant não encontrado.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create new purchase request
      const { error } = await supabase
        .from('purchase_requests')
        .insert({
          ...data,
          tenant_id: currentTenant.id,
          approver: '-', // No approver initially
        });

      if (error) {
        throw error;
      }

      toast({
        title: 'Pedido de compra criado',
        description: 'O pedido foi registrado com sucesso.',
      });

      onSuccess();
    } catch (error: any) {
      console.error('Error saving purchase request:', error);
      toast({
        title: 'Erro ao salvar',
        description: error.message || 'Ocorreu um erro ao processar sua solicitação.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            Novo Pedido de Compra
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número do Pedido*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requestDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data do Pedido*</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="requester"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Solicitante*</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do solicitante" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="supplier_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fornecedor*</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isLoadingSuppliers}
                  >
                    <FormControl>
                      <SelectTrigger>
                        {isLoadingSuppliers ? (
                          <div className="flex items-center">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            <span>Carregando...</span>
                          </div>
                        ) : (
                          <SelectValue placeholder="Selecione um fornecedor" />
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                      {suppliers.length === 0 && (
                        <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                          Nenhum fornecedor encontrado.
                          <div className="mt-2">
                            <Button 
                              variant="link" 
                              className="p-0 h-auto" 
                              onClick={() => window.location.href = '/clients-suppliers'}
                            >
                              Cadastrar fornecedor
                            </Button>
                          </div>
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="items"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade de Itens*</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1} 
                      {...field} 
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="total"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor Total (R$)*</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={0} 
                      step="0.01" 
                      {...field} 
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Detalhes sobre o pedido de compra" 
                    rows={3} 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button 
            variant="outline" 
            type="button" 
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading || isLoadingSuppliers}
          >
            {isLoading ? 'Salvando...' : 'Criar Pedido'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
