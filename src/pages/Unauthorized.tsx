
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <AlertTriangle className="h-16 w-16 text-yellow-500" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Acesso não autorizado</h1>
        <p className="text-lg text-gray-600 mb-6">
          Você não tem permissão para acessar esta página. 
          Por favor, contate o administrador do sistema caso acredite que isto é um erro.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate(-1)}>Voltar</Button>
          <Button variant="outline" onClick={() => navigate("/")}>Ir para Dashboard</Button>
        </div>
      </div>
    </div>
  );
}
