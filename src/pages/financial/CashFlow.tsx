
import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { CashFlow as CashFlowType } from '@/types/financial';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown } from 'lucide-react';

// Mock data for cash flow
const cashFlowMock: CashFlowType[] = [
  { period: 'Jan', income: 5000, expenses: 3200, balance: 1800 },
  { period: 'Fev', income: 5500, expenses: 3400, balance: 2100 },
  { period: 'Mar', income: 6000, expenses: 4200, balance: 1800 },
  { period: 'Abr', income: 5800, expenses: 3800, balance: 2000 },
  { period: 'Mai', income: 6200, expenses: 4000, balance: 2200 },
  { period: 'Jun', income: 7000, expenses: 4500, balance: 2500 },
  { period: 'Jul', income: 6800, expenses: 4200, balance: 2600 },
  { period: 'Ago', income: 7200, expenses: 4800, balance: 2400 },
  { period: 'Set', income: 7500, expenses: 5000, balance: 2500 },
  { period: 'Out', income: 8000, expenses: 5200, balance: 2800 },
  { period: 'Nov', income: 8500, expenses: 5500, balance: 3000 },
  { period: 'Dez', income: 9000, expenses: 6000, balance: 3000 },
];

// Calculate totals
const calculateTotals = (data: CashFlowType[]) => {
  return data.reduce(
    (acc, curr) => {
      acc.income += curr.income;
      acc.expenses += curr.expenses;
      acc.balance += curr.balance;
      return acc;
    },
    { income: 0, expenses: 0, balance: 0 }
  );
};

const CashFlow = () => {
  const [cashFlowData] = useState(cashFlowMock);
  const totals = calculateTotals(cashFlowData);

  return (
    <Layout title="Fluxo de Caixa">
      <div className="flex flex-col gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Fluxo de Caixa</h2>
          <p className="text-muted-foreground">
            Visualize suas receitas, despesas e saldo ao longo do tempo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Receitas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {totals.income.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </div>
                <Badge className="bg-green-100 text-green-800 border-0">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  Receitas
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Despesas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {totals.expenses.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </div>
                <Badge className="bg-red-100 text-red-800 border-0">
                  <ArrowDown className="h-4 w-4 mr-1" />
                  Despesas
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Saldo Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {totals.balance.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </div>
                <Badge
                  className={
                    totals.balance >= 0
                      ? 'bg-blue-100 text-blue-800 border-0'
                      : 'bg-red-100 text-red-800 border-0'
                  }
                >
                  Saldo
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Fluxo de Caixa Anual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={cashFlowData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) =>
                      new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(value as number)
                    }
                  />
                  <Legend />
                  <Bar dataKey="income" name="Receitas" fill="#10B981" />
                  <Bar dataKey="expenses" name="Despesas" fill="#EF4444" />
                  <Bar dataKey="balance" name="Saldo" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CashFlow;
