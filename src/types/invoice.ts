
// Tipos relacionados às notas fiscais
import { Product } from './inventory';

export type Invoice = {
  id: string;
  number: string;
  emitter_name: string;
  recipient_name: string;
  issue_date: string;
  total: number;
  tenant_id: string;
};

export type InvoiceItem = {
  id: string;
  invoice_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  product?: Product;
};

export type InvoiceWithItems = Invoice & {
  items: InvoiceItem[];
};
