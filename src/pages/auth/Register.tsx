
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Box, Building } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erro na validação",
        description: "As senhas não coincidem.",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulating registration - this would be replaced with actual Supabase logic
      toast({
        title: "Conta criada com sucesso",
        description: "Você será redirecionado para o login.",
      });
      
      // Simulate a delay before redirecting
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: "Não foi possível criar sua conta. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="flex items-center justify-center mb-4">
            <Box className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold ml-2">FluxoERP</span>
          </div>
          <CardTitle className="text-2xl">Crie sua conta</CardTitle>
          <CardDescription>
            Preencha os dados abaixo para criar sua conta e empresa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input 
                id="name" 
                type="text" 
                placeholder="Seu nome completo" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="seu@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Escolha uma senha segura"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                placeholder="Repita sua senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Building className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-base font-medium">Dados da empresa</h3>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="companyName">Nome da empresa</Label>
              <Input 
                id="companyName" 
                type="text" 
                placeholder="Nome da sua empresa" 
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input 
                id="cnpj" 
                type="text" 
                placeholder="00.000.000/0001-00" 
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registrando..." : "Criar conta"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-center text-sm text-muted-foreground mt-2">
            Já tem uma conta?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Faça login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
