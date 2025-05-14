
// Tipos relacionados às ordens de serviço
import { Product } from './inventory';

export type ServiceOrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export type ServiceOrder = {
  id: string;
  number: string;
  client_name: string;
  responsible: string;
  description: string;
  status: ServiceOrderStatus;
  date: string;
  total: number;
  tenant_id: string;
  created_at: string;
  updated_at: string;
};

export type ServiceOrderItem = {
  id: string;
  service_order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  product?: Product;
};

export type ServiceOrderWithItems = ServiceOrder & {
  items: ServiceOrderItem[];
};
