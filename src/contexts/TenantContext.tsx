
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/sonner';
import { User } from '@supabase/supabase-js';

interface Tenant {
  id: string;
  name: string;
  user_id: string;
}

interface TenantContextType {
  currentTenant: Tenant | null;
  isLoading: boolean;
  user: User | null;
  setCurrentTenant: (tenant: Tenant | null) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider = ({ children }: { children: ReactNode }) => {
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const initializeTenant = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user) {
          setUser(null);
          setCurrentTenant(null);
          return;
        }

        setUser(session.user);
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*, tenants(*)')
          .eq('id', session.user.id)
          .maybeSingle();

        if (userError || !userData) {
          console.error('Erro ao buscar usuário:', userError);
          setCurrentTenant(null);
          setUser(null);
          await supabase.auth.signOut();
          window.location.href = '/login';
          return;
        }

        if (!userData.tenant_id || !userData.tenants) {
          setCurrentTenant(null);
          setUser(null);
          await supabase.auth.signOut();
          window.location.href = '/login';
          return;
        }

        setCurrentTenant(userData.tenants);
        await supabase.rpc('set_tenant_id', { id: userData.tenant_id });
      } catch (error: any) {
        console.error('Erro ao carregar tenant:', error);
        setCurrentTenant(null);
        toast.error('Erro ao carregar dados do tenant', {
          description: error.message
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeTenant();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setCurrentTenant(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <TenantContext.Provider value={{ currentTenant, isLoading, user, setCurrentTenant }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider');
  }
  return context;
};
