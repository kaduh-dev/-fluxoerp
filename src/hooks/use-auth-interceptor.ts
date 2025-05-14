
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/sonner';

export const useAuthInterceptor = () => {
  const { refreshSession, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'TOKEN_REFRESHED') {
        await refreshSession();
      }
      
      if (event === 'SIGNED_OUT') {
        navigate('/login');
      }
    });

    const handleAuthError = (error: any) => {
      if (error?.message?.includes('JWT')) {
        toast.error('Sessão expirada', {
          description: 'Por favor, faça login novamente'
        });
        logout();
      }
    };

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [refreshSession, logout, navigate]);
};
