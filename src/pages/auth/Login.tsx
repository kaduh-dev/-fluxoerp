
import { LoginForm } from '@/components/LoginForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Box } from 'lucide-react';

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="flex items-center justify-center mb-4">
            <Box className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold ml-2">FluxoERP</span>
          </div>
          <CardTitle className="text-2xl">Bem-vindo</CardTitle>
          <CardDescription>
            Faça login para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
