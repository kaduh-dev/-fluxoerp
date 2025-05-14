
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Settings = () => {
  return (
    <Layout title="Configurações">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Configurações do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Configurações gerais do sistema</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;
