
import { Layout } from "@/components/layout/Layout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package2, Users, ClipboardList, ShoppingCart, BarChart3, AlertTriangle } from "lucide-react";
import { Activity } from "@/types/activity";

const Index = () => {
  // Mock data for statistics
  const stats = [
    {
      title: "Produtos Cadastrados",
      value: "342",
      icon: Package2,
      description: "32 produtos com estoque baixo",
      trend: { value: 12, isPositive: true }
    },
    {
      title: "Clientes Ativos",
      value: "120",
      icon: Users,
      description: "15 novos este mês",
      trend: { value: 8, isPositive: true }
    },
    {
      title: "Ordens de Serviço",
      value: "64",
      icon: ClipboardList,
      description: "24 em andamento",
      trend: { value: 5, isPositive: false }
    },
    {
      title: "Solicitações de Compra",
      value: "18",
      icon: ShoppingCart,
      description: "7 aguardando aprovação",
      trend: { value: 3, isPositive: true }
    },
    {
      title: "Despesas do Mês",
      value: "R$ 24.560",
      icon: BarChart3,
      description: "7% abaixo do mês anterior",
      trend: { value: 7, isPositive: true }
    }
  ];

  // Mock data for alerts
  const alerts = [
    {
      title: "Produtos com estoque baixo",
      description: "32 produtos estão abaixo do estoque mínimo",
      icon: AlertTriangle,
      severity: "warning"
    },
    {
      title: "Ordens de serviço atrasadas",
      description: "8 ordens estão atrasadas há mais de 2 dias",
      icon: AlertTriangle,
      severity: "error"
    },
    {
      title: "Pagamentos pendentes",
      description: "3 pagamentos vencem hoje",
      icon: AlertTriangle,
      severity: "warning"
    }
  ];

  // Mock data for activity
  const activities: Activity[] = [
    {
      id: "act-001",
      type: "inventory",
      description: "Entrada de 50 unidades de teclados",
      user: "Maria Silva",
      timestamp: new Date(2023, 4, 10, 9, 30)
    },
    {
      id: "act-002",
      type: "order",
      description: "OS #1234 marcada como concluída",
      user: "João Santos",
      timestamp: new Date(2023, 4, 10, 11, 15)
    },
    {
      id: "act-003",
      type: "purchase",
      description: "Pedido #4567 aprovado",
      user: "Ana Oliveira",
      timestamp: new Date(2023, 4, 10, 13, 45)
    },
    {
      id: "act-004",
      type: "expense",
      description: "Lançamento de R$ 2.500 em despesas",
      user: "Carlos Mendes",
      timestamp: new Date(2023, 4, 10, 15, 20)
    },
    {
      id: "act-005",
      type: "invoice",
      description: "NF-e #987654 registrada",
      user: "Lucia Ferreira",
      timestamp: new Date(2023, 4, 10, 16, 50)
    }
  ];

  return (
    <Layout title="Dashboard">
      <div className="grid gap-6">
        {/* Quick Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {stats.map((stat, index) => (
            <StatCard 
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              description={stat.description}
              trend={stat.trend}
            />
          ))}
        </section>

        {/* Alerts Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alerts.map((alert, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className={`p-2 rounded-full ${
                  alert.severity === "error" ? "bg-red-100 text-red-600" : 
                  alert.severity === "warning" ? "bg-amber-100 text-amber-600" : 
                  "bg-blue-100 text-blue-600"
                }`}>
                  <alert.icon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">
                    {alert.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-muted-foreground">
                  {alert.description}
                </CardDescription>
                <div className="mt-4 flex justify-end">
                  <Badge 
                    variant={alert.severity === "error" ? "destructive" : "outline"}
                    className={`${
                      alert.severity === "warning" && "bg-amber-100 text-amber-600 hover:bg-amber-200 hover:text-amber-700"
                    }`}
                  >
                    {alert.severity === "error" ? "Crítico" : "Atenção"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Recent Activity Section */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
              <CardDescription>As últimas atividades registradas no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentActivity activities={activities} />
            </CardContent>
          </Card>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
