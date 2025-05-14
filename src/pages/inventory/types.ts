export type Product = {
  id: string;
  name: string;
  code: string;
  category: string;
  unit: string; // ex: unidade, kg, litro
  sale_price: number;
  stock: number;
  notes?: string;
  tenant_id: string;
  created_at: string;
  status?: 'normal' | 'low';
};

export type StockMovement = {
  id: string;
  product_id: string;
  type: "entry" | "exit"; // entrada ou saída
  quantity: number;
  reason: string;
  tenant_id: string;
  created_at: string;
};

export type StockMovementWithProduct = StockMovement & {
  product: Product;
};