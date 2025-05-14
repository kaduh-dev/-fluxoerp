
export type ClientSupplierType = 'client' | 'supplier' | 'both';
export type ClientSupplierStatus = 'active' | 'inactive';

export interface ClientSupplier {
  id: string;
  name: string;
  cnpj_cpf: string;
  address: string | null;
  city: string | null;
  state: string | null;
  phone: string | null;
  email: string | null;
  type: ClientSupplierType;
  status: ClientSupplierStatus;
  notes: string | null;
  tenant_id: string;
  created_at: string;
}
