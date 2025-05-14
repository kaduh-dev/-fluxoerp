
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Acesso não autorizado</h1>
          <p className="text-muted-foreground">
            Você não tem permissão para acessar esta página. Verifique suas credenciais ou entre em contato com o administrador.
          </p>
        </div>
        
        <div className="flex flex-col space-y-3">
          <Button onClick={() => navigate(-1)} variant="default">
            Voltar
          </Button>
          <Button onClick={() => navigate("/dashboard")} variant="outline">
            Ir para Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
