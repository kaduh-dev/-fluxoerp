
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Box } from 'lucide-react';

const RecoverPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulating password recovery request - this would be replaced with actual Supabase logic
      
      // Show success feedback
      toast({
        title: "E-mail enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
      
      setSubmitted(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao recuperar senha",
        description: "Não foi possível enviar o e-mail de recuperação. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="flex items-center justify-center mb-4">
            <Box className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold ml-2">FluxoERP</span>
          </div>
          <CardTitle className="text-2xl">Recuperar senha</CardTitle>
          <CardDescription>
            {!submitted 
              ? "Digite seu e-mail para receber um link de recuperação de senha"
              : "Verifique seu e-mail para redefinir sua senha"}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Enviando..." : "Enviar link de recuperação"}
              </Button>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Um e-mail com instruções para redefinir sua senha foi enviado para {email}.
                Verifique sua caixa de entrada e spam.
              </p>
              <Button 
                variant="outline" 
                onClick={() => setSubmitted(false)}
              >
                Tentar outro e-mail
              </Button>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col">
          <div className="text-center text-sm text-muted-foreground mt-2">
            <Link to="/login" className="text-primary hover:underline">
              Voltar para o login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RecoverPassword;
