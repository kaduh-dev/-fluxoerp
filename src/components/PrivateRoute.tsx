
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export function PrivateRoute({ children, requiredRoles }: PrivateRouteProps) {
  const { user, isLoading, hasRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requiredRoles && !hasRole(requiredRoles)) {
    toast.error('Acesso não autorizado');
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
