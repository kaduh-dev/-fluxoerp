
export type Product = {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  minStock: number;
  location: string;
  price: number;
  status: "normal" | "low" | "out";
};
