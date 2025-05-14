
import { ClientSupplier } from './clientSupplier';

export type PurchaseRequestStatus = 'pending' | 'approved' | 'rejected' | 'delivered';

export interface PurchaseRequest {
  id: string;
  number: string;
  requester: string;
  approver: string;
  supplier_id: string | null;
  items: number;
  total: number;
  status: PurchaseRequestStatus;
  requestDate: string;
}

export interface PurchaseRequestWithSupplier extends PurchaseRequest {
  supplier: ClientSupplier | null;
}
