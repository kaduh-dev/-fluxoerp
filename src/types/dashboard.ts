
// Tipos relacionados ao dashboard
import { StockMovementWithProduct } from './inventory';
import { FinancialEntry } from './financial';

export type DashboardSummary = {
  product_count: number;
  total_stock_value: number;
  cash_flow: {
    income: number;
    expenses: number;
    balance: number;
  };
  ongoing_service_orders: number;
  recent_stock_movements: StockMovementWithProduct[];
  recent_financial_entries: FinancialEntry[];
};
