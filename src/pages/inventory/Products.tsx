
import { Layout } from "@/components/layout/Layout";
import { ProductActions } from "./components/ProductActions";
import { ProductsTable } from "./components/ProductsTable";
import { SummaryCards } from "./components/SummaryCards";
import { useProducts } from "./hooks/useProducts";
import { useTenant } from "@/contexts/TenantContext";

const Products = () => {
  const { currentTenant, isLoading: isLoadingTenant } = useTenant();
  const { 
    filteredProducts, 
    categories, 
    handleFilterChange,
    handleAddProduct 
  } = useProducts();

  return (
    <Layout title="Produtos">
      <div className="flex flex-col gap-6">
        <SummaryCards products={filteredProducts} />
        
        {filteredProducts ? (
          <div className="flex flex-col gap-4">
            <ProductActions 
              filteredProducts={filteredProducts} 
              totalProducts={filteredProducts?.length || 0} 
              onAddProduct={handleAddProduct} 
            />
            
            <ProductsTable 
              products={filteredProducts} 
              categories={categories}
              onFilterChange={handleFilterChange}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-96">
            <p className="text-lg text-muted-foreground">Nenhum produto cadastrado</p>
          </div>
        )}
      </div>
    </Layout>
  );

  return (
    <Layout title="Produtos">
      <div className="flex flex-col gap-6">
        <SummaryCards products={filteredProducts} />
        
        <div className="flex flex-col gap-4">
          <ProductActions 
            filteredProducts={filteredProducts} 
            totalProducts={filteredProducts?.length || 0} 
            onAddProduct={handleAddProduct} 
          />
          
          <ProductsTable 
            products={filteredProducts} 
            categories={categories}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Products;
