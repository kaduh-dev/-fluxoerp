
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center bg-card p-8 rounded-lg shadow-lg">
        <h1 className="text-6xl font-bold mb-4 text-destructive">404</h1>
        <p className="text-xl text-muted-foreground mb-6">Página não encontrada</p>
        <p className="text-muted-foreground mb-8">
          A página "{location.pathname}" não existe ou foi movida.
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Voltar
          </Button>
          <Button onClick={() => navigate("/dashboard")}>
            Ir para Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
