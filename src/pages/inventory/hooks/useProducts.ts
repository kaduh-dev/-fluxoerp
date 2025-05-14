
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { Product } from "../types";
import { Activity } from "@/types/activity";
import { supabase } from "@/lib/supabase";
import { useTenant } from "@/contexts/TenantContext";

const createActivityLog = (description: string): Activity => {
  return {
    id: `act-${Date.now()}`,
    type: "inventory",
    description,
    user: "Usuário Atual",
    timestamp: new Date(),
  };
};

export const useProducts = () => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    status: "all",
  });
  const { currentTenant } = useTenant();

  // Fetch products from Supabase
  const fetchProducts = async () => {
    if (!currentTenant) return;

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('tenant_id', currentTenant.id);

    if (error) {
      console.error('Error fetching products:', error);
      toast.error("Erro ao carregar produtos");
      return;
    }

    setFilteredProducts(data || []);
  };

  useEffect(() => {
    fetchProducts();
  }, [currentTenant]);

  // Apply filters
  useEffect(() => {
    const filtered = filteredProducts.filter((product) => {
      const matchesSearch =
        filters.search === "" ||
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.sku.toLowerCase().includes(filters.search.toLowerCase());
        
      const matchesCategory =
        filters.category === "all" || product.category === filters.category;
        
      const matchesStatus =
        filters.status === "all" || product.status === filters.status;
        
      return matchesSearch && matchesCategory && matchesStatus;
    });
    
    setFilteredProducts(filtered);
  }, [filters]);

  const handleFilterChange = (newFilters: {
    search: string;
    category: string;
    status: string;
  }) => {
    setFilters(newFilters);
  };

  const handleAddProduct = async (newProduct: Omit<Product, 'id'>) => {
    if (!currentTenant?.id) {
      toast.error("Erro: Por favor, faça login novamente");
      return;
    }

    const { data, error } = await supabase
      .from('products')
      .insert([{
        ...newProduct,
        tenant_id: currentTenant.id,
        status: newProduct.quantity <= newProduct.minStock ? 'low' : 'normal'
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding product:', error);
      toast.error("Erro ao adicionar produto");
      return;
    }

    setFilteredProducts(prev => [...prev, data]);
    const activity = createActivityLog(`Produto ${data.name} adicionado ao estoque`);
    console.log("Activity logged:", activity);
    toast.success("Produto adicionado com sucesso");
  };

  const handleRemoveProduct = async (id: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error removing product:', error);
      toast.error("Erro ao remover produto");
      return;
    }

    setFilteredProducts(prev => prev.filter(p => p.id !== id));
    const activity = createActivityLog(`Produto removido do estoque`);
    console.log("Activity logged:", activity);
    toast.success("Produto removido com sucesso");
  };

  const categories = [...new Set(filteredProducts.map((p) => p.category))];

  return {
    filteredProducts,
    categories,
    handleFilterChange,
    handleAddProduct,
    handleRemoveProduct,
  };
};
