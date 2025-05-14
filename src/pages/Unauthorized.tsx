
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { AlertTriangle } from "lucide-react";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <Layout title="Acesso Não Autorizado">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="mb-6 p-4 bg-destructive/10 rounded-full">
          <AlertTriangle className="h-12 w-12 text-destructive" />
        </div>
        <h1 className="text-4xl font-bold text-destructive mb-4">Acesso Não Autorizado</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-md">
          Você não tem permissão para acessar esta página. Contate o administrador se acredita que isso é um erro.
        </p>
        <div className="flex gap-4">
          <Button onClick={() => navigate(-1)} variant="outline">
            Voltar
          </Button>
          <Button onClick={() => navigate("/dashboard")}>
            Ir para Dashboard
          </Button>
        </div>
      </div>
    </Layout>
  );
}
