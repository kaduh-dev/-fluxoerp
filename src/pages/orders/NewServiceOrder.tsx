
import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Plus, Trash2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from '@/contexts/TenantContext';

// Mock product data
const productsMock = [
  { id: '1', name: 'Teclado Mecânico', code: 'TEC001', price: 250.00, stock: 15 },
  { id: '2', name: 'Mouse Sem Fio', code: 'MOU001', price: 120.00, stock: 20 },
  { id: '3', name: 'Monitor 24"', code: 'MON001', price: 950.00, stock: 8 },
  { id: '4', name: 'Cabo HDMI 2.0', code: 'CAB001', price: 45.00, stock: 30 },
  { id: '5', name: 'SSD 480GB', code: 'SSD001', price: 350.00, stock: 12 },
];

const NewServiceOrder = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { currentTenant } = useTenant();
  
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [responsible, setResponsible] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<Array<{
    id: string;
    name: string;
    code: string;
    quantity: number;
    unitPrice: number;
  }>>([]);
  
  // Filter products based on search term
  const filteredProducts = productsMock.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddProduct = (product: typeof productsMock[0]) => {
    // Check if product already exists in the selected products
    const existingProduct = selectedProducts.find(p => p.id === product.id);
    
    if (existingProduct) {
      toast({
        variant: "destructive", // Changed from "warning" to "destructive"
        title: "Produto já adicionado",
        description: "Este produto já está na lista.",
      });
      return;
    }
    
    setSelectedProducts([
      ...selectedProducts,
      {
        id: product.id,
        name: product.name,
        code: product.code,
        quantity: 1,
        unitPrice: product.price,
      }
    ]);
    
    setSearchTerm('');
  };
  
  const handleUpdateQuantity = (id: string, quantity: number) => {
    // Don't allow negative or zero quantities
    if (quantity <= 0) return;
    
    // Check if there's enough stock
    const product = productsMock.find(p => p.id === id);
    if (product && quantity > product.stock) {
      toast({
        variant: "destructive", // Changed from "warning" to "destructive"
        title: "Estoque insuficiente",
        description: `Apenas ${product.stock} unidades disponíveis.`,
      });
      return;
    }
    
    setSelectedProducts(
      selectedProducts.map(p => 
        p.id === id ? { ...p, quantity } : p
      )
    );
  };
  
  const handleRemoveProduct = (id: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== id));
  };
  
  const calculateTotal = () => {
    return selectedProducts.reduce(
      (total, product) => total + product.quantity * product.unitPrice,
      0
    );
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!clientName || !description || !responsible || selectedProducts.length === 0) {
      toast({
        variant: "destructive",
        title: "Dados incompletos",
        description: "Preencha todos os campos obrigatórios e adicione pelo menos um produto.",
      });
      return;
    }

    if (!currentTenant) {
      toast({
        variant: "destructive",
        title: "Erro de tenant",
        description: "Não foi possível identificar sua empresa. Faça login novamente.",
      });
      return;
    }
    
    try {
      // Generate an order number (in a real app you might have a more sophisticated approach)
      const orderNumber = `OS-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      // Insert the service order
      const { data: serviceOrder, error: serviceOrderError } = await supabase
        .from('service_orders')
        .insert({
          number: orderNumber,
          client_name: clientName,
          responsible,
          description,
          status,
          date: new Date().toISOString().split('T')[0],
          total: calculateTotal(),
          tenant_id: currentTenant.id
        })
        .select()
        .single();
        
      if (serviceOrderError) {
        throw serviceOrderError;
      }
      
      // Insert service order items
      const orderItems = selectedProducts.map(product => ({
        service_order_id: serviceOrder.id,
        product_id: product.id,
        quantity: product.quantity,
        unit_price: product.unitPrice
      }));
      
      const { error: itemsError } = await supabase
        .from('service_order_items')
        .insert(orderItems);
        
      if (itemsError) {
        throw itemsError;
      }
      
      // If order status is completed, create stock movements for products
      if (status === 'completed') {
        const stockMovements = selectedProducts.map(product => ({
          product_id: product.id,
          type: 'exit',
          quantity: product.quantity,
          reason: `Saída por OS ${orderNumber}`,
          tenant_id: currentTenant.id
        }));
        
        const { error: stockError } = await supabase
          .from('stock_movements')
          .insert(stockMovements);
          
        if (stockError) {
          throw stockError;
        }
      }
      
      toast({
        title: "Ordem de serviço criada",
        description: `A OS ${orderNumber} foi criada com sucesso.`,
      });
      
      // Redirect to service orders list
      navigate('/orders');
    } catch (error) {
      console.error('Error creating service order:', error);
      toast({
        variant: "destructive",
        title: "Erro ao criar ordem de serviço",
        description: "Ocorreu um erro ao salvar os dados. Tente novamente.",
      });
    }
  };

  return (
    <Layout title="Nova Ordem de Serviço">
      <div className="flex flex-col gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Nova Ordem de Serviço</h2>
          <p className="text-muted-foreground">
            Cadastre uma nova ordem de serviço.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Dados do Cliente e Serviço</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Nome do Cliente</Label>
                    <Input 
                      id="clientName" 
                      value={clientName} 
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Nome do cliente"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="responsible">Responsável</Label>
                    <Input 
                      id="responsible" 
                      value={responsible} 
                      onChange={(e) => setResponsible(e.target.value)}
                      placeholder="Nome do responsável"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição do Serviço</Label>
                  <Textarea 
                    id="description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descreva o serviço a ser realizado"
                    rows={3}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={status} 
                    onValueChange={setStatus}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="in_progress">Em andamento</SelectItem>
                      <SelectItem value="completed">Concluído</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Produtos Utilizados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar produto por nome ou código..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                {searchTerm && filteredProducts.length > 0 && (
                  <Card>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Código</TableHead>
                          <TableHead>Nome</TableHead>
                          <TableHead className="text-right">Preço</TableHead>
                          <TableHead className="text-right">Estoque</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>{product.code}</TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell className="text-right">
                              {product.price.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                              })}
                            </TableCell>
                            <TableCell className="text-right">{product.stock}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                onClick={() => handleAddProduct(product)}
                                className="h-8 px-2"
                              >
                                <Plus className="h-4 w-4" />
                                <span className="sr-only">Adicionar</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                )}
                
                {searchTerm && filteredProducts.length === 0 && (
                  <div className="text-center p-4">
                    <p className="text-muted-foreground">Nenhum produto encontrado.</p>
                  </div>
                )}
                
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Produto</TableHead>
                        <TableHead className="text-right">Quantidade</TableHead>
                        <TableHead className="text-right">Preço Unit.</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>{product.code}</TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell className="text-right">
                            <Input
                              type="number"
                              value={product.quantity}
                              onChange={(e) => handleUpdateQuantity(product.id, parseInt(e.target.value) || 0)}
                              className="w-20 text-right ml-auto"
                              min="1"
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            {product.unitPrice.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })}
                          </TableCell>
                          <TableCell className="text-right">
                            {(product.quantity * product.unitPrice).toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveProduct(product.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                              <span className="sr-only">Remover</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      
                      {selectedProducts.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            Nenhum produto selecionado. Use a busca acima para adicionar produtos.
                          </TableCell>
                        </TableRow>
                      )}
                      
                      {selectedProducts.length > 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-right font-medium">
                            Total:
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            {calculateTotal().toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })}
                          </TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <CardFooter className="flex justify-between border rounded-md p-4">
            <Button type="button" variant="outline" onClick={() => navigate('/orders')}>
              Cancelar
            </Button>
            <Button type="submit">
              Salvar Ordem de Serviço
            </Button>
          </CardFooter>
        </form>
      </div>
    </Layout>
  );
};

export default NewServiceOrder;
