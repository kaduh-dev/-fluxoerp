import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2 } from 'lucide-react';
import { InventoryFilters } from '@/components/inventory/InventoryFilters';
import { SummaryCards } from './components/SummaryCards';
import { ProductsTable } from './components/ProductsTable';
import { Product } from './types';
import { useProducts } from './hooks/useProducts';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from '@/components/ui/sonner';
import { useTenant } from '@/contexts/TenantContext';
import { supabase } from '@/lib/supabase';

const Products = () => {
  const { currentTenant } = useTenant();
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    code: '',
    category: '',
    unit: 'un',
    sale_price: 0,
    stock: 0,
    notes: ''
  });

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      if (!currentTenant?.id) return;

      setIsLoading(true);

      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('tenant_id', currentTenant.id);

        if (error) throw error;

        setProducts(data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        toast({
          title: "Erro ao carregar produtos",
          description: "Verifique sua conexão e tente novamente.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [currentTenant]);

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Update filtered products when products change
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const categories = [...new Set(products.map(p => p.category))].filter(Boolean);

  const handleFilterChange = ({
    search,
    category,
    status
  }: {
    search: string;
    category: string;
    status: string;
  }) => {
    const filtered = products.filter(product => {
      const matchesSearch =
        search === '' ||
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.code?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = 
        category === 'all' || 
        product.category === category;

      const matchesStatus = 
        status === 'all' || 
        (status === 'low' ? (product.stock && product.stock <= 5) : true);

      return matchesSearch && matchesCategory && matchesStatus;
    });

    setFilteredProducts(filtered);
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.code) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e código do produto são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (!currentTenant?.id) {
        toast({
          title: "Erro",
          description: "Por favor, faça login novamente.",
          variant: "destructive"
        });
        return;
      }

      const productToAdd = {
        ...newProduct,
        tenant_id: currentTenant.id,
        created_at: new Date().toISOString()
      } as Product;

      const { data, error } = await supabase
        .from('products')
        .insert([productToAdd])
        .select()
        .single();

      if (error) throw error;

      setProducts(prev => [...prev, data]);
      setProductDialogOpen(false);
      setNewProduct({
        name: '',
        code: '',
        category: '',
        unit: 'un',
        sale_price: 0,
        stock: 0,
        notes: ''
      });

      toast({
        title: "Produto adicionado",
        description: "Produto adicionado com sucesso."
      });
    } catch (err: any) {
      console.error('Error adding product:', err);
      toast({
        title: "Erro ao adicionar produto",
        description: err.message || "Verifique os dados e tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleEditProduct = (id: string) => {
    const productToEdit = products.find(p => p.id === id);

    if (productToEdit) {
      setNewProduct(productToEdit);
      setProductDialogOpen(true);
    }
  };

  const handleRemoveProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProducts(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Produto removido",
        description: "Produto removido com sucesso."
      });
    } catch (err: any) {
      console.error('Error removing product:', err);
      toast({
        title: "Erro ao remover produto",
        description: err.message || "Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <Layout title="Produtos">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="ml-2">Carregando produtos...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Produtos">
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Produtos</h2>
            <p className="text-muted-foreground">
              Gerencie seu estoque de produtos e serviços
            </p>
          </div>
          <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Adicionar Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{newProduct.id ? 'Editar' : 'Adicionar'} Produto</DialogTitle>
                <DialogDescription>
                  Preencha os detalhes do produto. Os campos marcados com * são obrigatórios.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome*</Label>
                    <Input 
                      id="name" 
                      value={newProduct.name || ''} 
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      placeholder="Nome do produto" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code">Código*</Label>
                    <Input 
                      id="code" 
                      value={newProduct.code || ''} 
                      onChange={(e) => setNewProduct({...newProduct, code: e.target.value})}
                      placeholder="SKU-001" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Input 
                      id="category" 
                      value={newProduct.category || ''} 
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      placeholder="Categoria" 
                      list="categories"
                    />
                    <datalist id="categories">
                      {categories.map((cat) => (
                        <option key={cat} value={cat} />
                      ))}
                    </datalist>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unidade</Label>
                    <Select 
                      value={newProduct.unit || 'un'} 
                      onValueChange={(value) => setNewProduct({...newProduct, unit: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="un">Unidade</SelectItem>
                        <SelectItem value="kg">Quilograma</SelectItem>
                        <SelectItem value="l">Litro</SelectItem>
                        <SelectItem value="m">Metro</SelectItem>
                        <SelectItem value="cx">Caixa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sale_price">Preço de Venda (R$)</Label>
                    <Input 
                      id="sale_price" 
                      type="number"
                      value={newProduct.sale_price || ''} 
                      onChange={(e) => setNewProduct({...newProduct, sale_price: parseFloat(e.target.value) || 0})}
                      placeholder="0.00" 
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Quantidade em Estoque</Label>
                    <Input 
                      id="stock" 
                      type="number"
                      value={newProduct.stock || ''} 
                      onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value) || 0})}
                      placeholder="0" 
                      min="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Input 
                    id="notes" 
                    value={newProduct.notes || ''} 
                    onChange={(e) => setNewProduct({...newProduct, notes: e.target.value})}
                    placeholder="Observações sobre o produto" 
                  />
                </div>
              </div>

              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setProductDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleAddProduct}>
                  {newProduct.id ? 'Salvar' : 'Adicionar'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <InventoryFilters 
          categories={categories} 
          onFilterChange={handleFilterChange} 
        />

        <SummaryCards products={filteredProducts} />

        <ProductsTable 
          products={filteredProducts}
          onEdit={handleEditProduct}
          onRemove={handleRemoveProduct}
        />
      </div>
    </Layout>
  );
};

export default Products;