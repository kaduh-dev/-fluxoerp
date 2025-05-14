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
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/sonner';

const Dashboard = () => {
  const { currentTenant } = useTenant();
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    productCount: 0,
    lowStockCount: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    clientCount: 0,
    supplierCount: 0
  });
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentTenant?.id) return;

      try {
        setIsDataLoading(true);
        // Fetch product count
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('tenant_id', currentTenant.id);

        if (productsError) throw productsError;

        // Count low stock products
        const lowStockProducts = products?.filter(p => p.quantity <= p.minStock) || [];

        // Fetch financial data
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date();
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setDate(0);
        endOfMonth.setHours(23, 59, 59, 999);

        const { data: financialData, error: financialError } = await supabase
          .from('financial_entries')
          .select('value, type')
          .eq('tenant_id', currentTenant.id)
          .gte('created_at', startOfMonth.toISOString())
          .lte('created_at', endOfMonth.toISOString());

        if (financialError) throw financialError;

        let totalRevenue = 0;

        if (financialData) {
          const income = financialData
            .filter(item => item.type === 'income')
            .reduce((sum, item) => sum + (item.value || 0), 0);

          const expenses = financialData
            .filter(item => item.type === 'expense')
            .reduce((sum, item) => sum + (item.value || 0), 0);

          totalRevenue = income;
        }

        // Fetch order count
        const { count: pendingOrders, error: ordersError } = await supabase
          .from('service_orders')
          .select('*', { count: 'exact', head: true })
          .eq('tenant_id', currentTenant.id)
          .eq('status', 'pending');

        if (ordersError) throw ordersError;

        // Fetch clients and suppliers
        const { data: clientsSuppliers, error: csError } = await supabase
          .from('clients_suppliers')
          .select('*')
          .eq('tenant_id', currentTenant.id);

        if (csError) throw csError;

        const clientCount = clientsSuppliers?.filter(cs => cs.type === 'client').length || 0;
        const supplierCount = clientsSuppliers?.filter(cs => cs.type === 'supplier').length || 0;

        setDashboardData({
          productCount: products?.length || 0,
          lowStockCount: lowStockProducts.length,
          totalRevenue,
          pendingOrders: pendingOrders || 0,
          clientCount,
          supplierCount
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error("Erro ao carregar dados do dashboard", {
          description: "Verifique a conexão e tente novamente."
        });
      } finally {
        setIsDataLoading(false);
      }
    };

    if (currentTenant?.id && !isLoading) {
      fetchDashboardData();
    }
  }, [currentTenant, isLoading]);

  if (isLoading || isDataLoading) {
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
      value: dashboardData.productCount.toString(),
      icon: Package,
      description: `${dashboardData.lowStockCount} produtos com estoque baixo`,
      trend: { value: dashboardData.productCount > 0 ? 5 : 0, isPositive: true },
      onClick: () => navigate('/inventory')
    },
    {
      title: "Ordens de Serviço",
      value: dashboardData.pendingOrders.toString(),
      icon: ClipboardList,
      description: `${dashboardData.pendingOrders} pendentes de aprovação`,
      trend: { value: dashboardData.pendingOrders > 0 ? 8 : 0, isPositive: true },
      onClick: () => navigate('/orders')
    },
    {
      title: "Faturamento Mensal",
      value: `R$ ${dashboardData.totalRevenue.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`,
      icon: CircleDollarSign,
      description: "vs mês anterior",
      trend: { value: dashboardData.totalRevenue > 0 ? 15 : 0, isPositive: true },
      onClick: () => navigate('/financial')
    },
    {
      title: "Clientes/Fornecedores",
      value: `${dashboardData.clientCount + dashboardData.supplierCount}`,
      icon: Users,
      description: `${dashboardData.supplierCount} fornecedores ativos`,
      trend: { value: (dashboardData.clientCount + dashboardData.supplierCount) > 0 ? 5 : 0, isPositive: true },
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
    <Layout title="Painel de Controle">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Bem-vindo ao Fluxos
            </h2>
            <p className="text-muted-foreground mt-2">
              {currentTenant?.name} - Visão geral do seu negócio
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/reports')}>
              Relatórios
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              {...stat}
              className="cursor-pointer hover:shadow-md hover:border-primary/50 transition-all"
              onClick={stat.onClick}
            />
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Resumo do Negócio</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <CircleDollarSign className="h-5 w-5 text-primary" />
                  Resumo Financeiro
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Receitas</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-medium">
                        R$ {dashboardData.totalRevenue.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Despesas</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-medium">
                        R$ {(dashboardData.totalRevenue * 0.65).toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </span>
                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Saldo</span>
                      <span className="text-xl font-bold text-green-600">
                        R$ {(dashboardData.totalRevenue * 0.35).toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  Atividades Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RecentActivity activities={activities} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;