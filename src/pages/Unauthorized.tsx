
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <Layout title="Acesso Não Autorizado">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Acesso Não Autorizado</h1>
        <p className="text-lg text-gray-600 mb-8">
          Você não tem permissão para acessar esta página.
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
