
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

    try {
      // Generate a random ID (simulate UUID)
      const productId = `prod_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      
      // Generate a timestamp for created_at
      const createdAt = new Date().toISOString();
      
      // Create the complete product object
      const completeProduct = {
        ...newProduct,
        id: productId,
        tenant_id: currentTenant.id,
        status: (newProduct.quantity && newProduct.minStock && newProduct.quantity <= newProduct.minStock) ? 'low' : 'normal',
        created_at: createdAt
      };

      const { data, error } = await supabase
        .from('products')
        .insert([completeProduct])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.error("Produto com este código já existe");
        } else {
          console.error('Error adding product:', error);
          toast.error("Erro ao adicionar produto");
        }
        return;
      }

      // If we get data back, use it, otherwise use our complete product object
      const productToAdd = data || completeProduct;
      
      setFilteredProducts(prev => [...prev, productToAdd]);
      
      // Log activity
      const activity = createActivityLog(`Produto ${productToAdd.name} adicionado ao estoque`);
      console.log("Activity logged:", activity);
      
      // Optionally, save activity to database
      try {
        await supabase.from('activities').insert([{
          tenant_id: currentTenant.id,
          type: 'inventory',
          description: `Produto ${productToAdd.name} adicionado ao estoque`,
          user_id: 'current_user_id', // Replace with actual user ID
          created_at: new Date().toISOString()
        }]);
      } catch (activityError) {
        console.error('Error logging activity:', activityError);
      }
      
      toast.success("Produto adicionado com sucesso");
      
      // Force a refresh of products
      fetchProducts();
      
      return productToAdd;
    } catch (err) {
      console.error('Unexpected error adding product:', err);
      toast.error("Erro inesperado ao adicionar produto");
      return null;
    }
  };

  const handleRemoveProduct = async (id: string) => {
    try {
      // Find the product to be removed for activity logging
      const productToRemove = filteredProducts.find(p => p.id === id);
      
      if (!productToRemove) {
        toast.error("Produto não encontrado");
        return false;
      }
      
      // Check if there are any dependencies (stock movements, sales, etc.)
      const { count, error: countError } = await supabase
        .from('stock_movements')
        .select('*', { count: 'exact', head: true })
        .eq('product_id', id);
        
      if (countError) {
        console.error('Error checking dependencies:', countError);
      } else if (count && count > 0) {
        toast.error("Este produto possui movimentações de estoque e não pode ser removido");
        return false;
      }
      
      // Proceed with deletion
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error removing product:', error);
        toast.error("Erro ao remover produto");
        return false;
      }

      // Update the local state
      setFilteredProducts(prev => prev.filter(p => p.id !== id));
      
      // Log activity
      const activity = createActivityLog(`Produto ${productToRemove.name} removido do estoque`);
      console.log("Activity logged:", activity);
      
      // Optionally, save activity to database
      try {
        await supabase.from('activities').insert([{
          tenant_id: currentTenant?.id,
          type: 'inventory',
          description: `Produto ${productToRemove.name} removido do estoque`,
          user_id: 'current_user_id', // Replace with actual user ID
          created_at: new Date().toISOString()
        }]);
      } catch (activityError) {
        console.error('Error logging activity:', activityError);
      }
      
      toast.success("Produto removido com sucesso");
      return true;
    } catch (err) {
      console.error('Unexpected error removing product:', err);
      toast.error("Erro inesperado ao remover produto");
      return false;
    }
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
