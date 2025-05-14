
// Tipos relacionados ao módulo financeiro

export type FinancialEntryStatus = "pending" | "paid";
export type FinancialEntryType = "income" | "expense";

export type FinancialEntry = {
  id: string;
  description: string;
  value: number;
  due_date: string;
  payment_date?: string;
  status: FinancialEntryStatus;
  type: FinancialEntryType;
  category: string;
  notes?: string;
  tenant_id: string;
  created_at: string;
};

export type CashFlow = {
  period: string;
  income: number;
  expenses: number;
  balance: number;
};
export interface FinancialEntry {
  id: string;
  tenant_id: string;
  created_at: string;
  value: number;
  type: 'income' | 'expense';
  description: string;
  category?: string;
  paymentMethod?: string;
  date?: string;
}
