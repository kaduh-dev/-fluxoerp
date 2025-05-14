import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTenant } from '@/contexts/TenantContext';
import { useAuth } from '@/contexts/AuthContext';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import {
  CircleDollarSign,
  Package,
  ClipboardList,
  TrendingUp,
  FileText,
  AlertCircle,
  Users,
  Loader2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { currentTenant } = useTenant();
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Layout title="Dashboard">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="ml-2">Carregando...</p>
        </div>
      </Layout>
    );
  }

  const stats = [
    {
      title: "Estoque",
      value: "126",
      icon: Package,
      description: "14 produtos com estoque baixo",
      trend: { value: 12, isPositive: true },
      onClick: () => navigate('/inventory')
    },
    {
      title: "Ordens de Serviço",
      value: "8",
      icon: ClipboardList,
      description: "3 pendentes de aprovação",
      trend: { value: 8, isPositive: true },
      onClick: () => navigate('/orders')
    },
    {
      title: "Faturamento Mensal",
      value: "R$ 12.750,50",
      icon: CircleDollarSign,
      description: "vs mês anterior",
      trend: { value: 15, isPositive: true },
      onClick: () => navigate('/financial')
    },
    {
      title: "Clientes/Fornecedores",
      value: "50",
      icon: Users,
      description: "20 fornecedores ativos",
      trend: { value: 5, isPositive: true },
      onClick: () => navigate('/clients-suppliers')
    }
  ];

  const activities = [
    {
      id: "1",
      type: "inventory",
      description: "Novo produto cadastrado: Teclado Mecânico",
      user: "Maria Silva",
      timestamp: new Date(2024, 2, 15, 14, 30)
    },
    {
      id: "2",
      type: "order",
      description: "OS #1234 finalizada com sucesso",
      user: "João Santos",
      timestamp: new Date(2024, 2, 15, 13, 45)
    },
    {
      id: "3",
      type: "invoice",
      description: "NF-e #987 emitida - R$ 1.250,00",
      user: "Ana Costa",
      timestamp: new Date(2024, 2, 15, 11, 20)
    }
  ];

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Bem-vindo ao FluxoERP
            </h2>
            <p className="text-muted-foreground mt-2">
              {currentTenant?.name} - Visão geral do seu negócio
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/reports')}>
              Relatórios
            </Button>
            <Button onClick={() => navigate('/financial')}>
              Financeiro
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              {...stat}
              className="cursor-pointer hover:border-primary/50 transition-colors"
              onClick={stat.onClick}
            />
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Resumo Financeiro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Receitas</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-medium">R$ 12.750,50</span>
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Despesas</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-medium">R$ 8.320,30</span>
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Saldo</span>
                    <span className="text-xl font-bold text-green-600">
                      R$ 4.430,20
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Atividades Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RecentActivity activities={activities} />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;