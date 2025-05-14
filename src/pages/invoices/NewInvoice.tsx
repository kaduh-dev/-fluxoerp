
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Plus, Trash2, Search, CalendarDays } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
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

const NewInvoice = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { currentTenant } = useTenant();
  
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [emitterName, setEmitterName] = useState('Minha Empresa LTDA');
  const [recipientName, setRecipientName] = useState('');
  const [recipientDocument, setRecipientDocument] = useState('');
  const [issueDate, setIssueDate] = useState<Date | undefined>(new Date());
  const [invoiceType, setInvoiceType] = useState('entrada');
  
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
    
    setSelectedProducts(
      selectedProducts.map(p => 
        p.id === id ? { ...p, quantity } : p
      )
    );
  };
  
  const handleUpdatePrice = (id: string, unitPrice: number) => {
    // Don't allow negative prices
    if (unitPrice < 0) return;
    
    setSelectedProducts(
      selectedProducts.map(p => 
        p.id === id ? { ...p, unitPrice } : p
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
    if (!invoiceNumber || !recipientName || !issueDate || selectedProducts.length === 0) {
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
      // Insert the invoice
      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          number: invoiceNumber,
          emitter_name: emitterName,
          recipient_name: recipientName,
          issue_date: issueDate ? format(issueDate, 'yyyy-MM-dd') : new Date().toISOString().split('T')[0],
          total: calculateTotal(),
          tenant_id: currentTenant.id
        })
        .select()
        .single();
        
      if (invoiceError) {
        throw invoiceError;
      }
      
      // Insert invoice items
      const invoiceItems = selectedProducts.map(product => ({
        invoice_id: invoice.id,
        product_id: product.id,
        quantity: product.quantity,
        unit_price: product.unitPrice
      }));
      
      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(invoiceItems);
        
      if (itemsError) {
        throw itemsError;
      }
      
      // If invoice type is 'entrada', create stock entry movements
      if (invoiceType === 'entrada') {
        const stockMovements = selectedProducts.map(product => ({
          product_id: product.id,
          type: 'entry',
          quantity: product.quantity,
          reason: `Entrada por NF ${invoiceNumber}`,
          tenant_id: currentTenant.id
        }));
        
        const { error: stockError } = await supabase
          .from('stock_movements')
          .insert(stockMovements);
          
        if (stockError) {
          throw stockError;
        }
      } 
      // If invoice type is 'saída', create stock exit movements
      else if (invoiceType === 'saída') {
        const stockMovements = selectedProducts.map(product => ({
          product_id: product.id,
          type: 'exit',
          quantity: product.quantity,
          reason: `Saída por NF ${invoiceNumber}`,
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
        title: "Nota fiscal criada",
        description: "A nota fiscal foi criada com sucesso.",
      });
      
      // Redirect to invoices list
      navigate('/invoices');
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast({
        variant: "destructive",
        title: "Erro ao criar nota fiscal",
        description: "Ocorreu um erro ao salvar os dados. Tente novamente.",
      });
    }
  };

  return (
    <Layout title="Nova Nota Fiscal">
      <div className="flex flex-col gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Nova Nota Fiscal</h2>
          <p className="text-muted-foreground">
            Cadastre uma nova nota fiscal.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Dados da Nota Fiscal</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoiceNumber">Número da NF</Label>
                    <Input 
                      id="invoiceNumber" 
                      value={invoiceNumber} 
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      placeholder="Número da NF"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="issueDate">Data de Emissão</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarDays className="mr-2 h-4 w-4" />
                          {issueDate ? format(issueDate, 'P', { locale: pt }) : <span>Escolha uma data</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={issueDate}
                          onSelect={setIssueDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="invoiceType">Tipo de Nota</Label>
                    <Select 
                      value={invoiceType} 
                      onValueChange={setInvoiceType}
                    >
                      <SelectTrigger id="invoiceType">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entrada">Nota de Entrada</SelectItem>
                        <SelectItem value="saída">Nota de Saída</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emitterName">Emitente</Label>
                    <Input 
                      id="emitterName" 
                      value={emitterName} 
                      onChange={(e) => setEmitterName(e.target.value)}
                      placeholder="Nome do emitente"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="recipientName">Destinatário</Label>
                    <Input 
                      id="recipientName" 
                      value={recipientName} 
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Nome do destinatário"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="recipientDocument">CNPJ/CPF do Destinatário</Label>
                  <Input 
                    id="recipientDocument" 
                    value={recipientDocument} 
                    onChange={(e) => setRecipientDocument(e.target.value)}
                    placeholder="CNPJ ou CPF do destinatário"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Itens da Nota Fiscal</CardTitle>
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
                            <Input
                              type="number"
                              value={product.unitPrice}
                              onChange={(e) => handleUpdatePrice(product.id, parseFloat(e.target.value) || 0)}
                              className="w-24 text-right ml-auto"
                              min="0"
                              step="0.01"
                            />
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
            <Button type="button" variant="outline" onClick={() => navigate('/invoices')}>
              Cancelar
            </Button>
            <Button type="submit">
              Salvar Nota Fiscal
            </Button>
          </CardFooter>
        </form>
      </div>
    </Layout>
  );
};

export default NewInvoice;
