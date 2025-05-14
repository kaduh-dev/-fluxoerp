import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/sonner';
import { AuthUser, ProfileData } from '@/types/auth';
import { useTenant } from './TenantContext';

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: { email: string; password: string; full_name: string }) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: ProfileData) => Promise<void>;
  hasRole: (requiredRole: string | string[]) => boolean;
  checkPermission: (permission: string) => Promise<boolean>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { currentTenant } = useTenant();

  const loadUserProfile = async (authUser: User) => {
    try {
      // First try to get existing profile
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profile) {
        return {
          ...authUser,
          role: profile.role || 'user',
          full_name: profile.full_name
        };
      }

      // If no profile exists, create basic profile first
      await supabase.rpc('set_tenant_id', { id: currentTenant?.id });
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .upsert([{
          id: authUser.id,
          full_name: authUser.user_metadata?.full_name || '',
          role: 'user',
          tenant_id: currentTenant?.id
        }], {
          onConflict: 'id'
        })
        .select()
        .single();

      console.log('Profile created:', newProfile);

      if (insertError) {
        console.error('Error creating profile:', insertError);
        return {
          ...authUser,
          role: 'user',
          full_name: authUser.user_metadata?.full_name || ''
        };
      }

      return {
        ...authUser,
        role: profile?.role || 'user',
        full_name: profile?.full_name
      };
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  };

  const refreshSession = async () => {
    try {
      const { data: { session: newSession }, error } = await supabase.auth.refreshSession();
      if (error) throw error;

      setSession(newSession);
      if (newSession?.user) {
        const userProfile = await loadUserProfile(newSession.user);
        setUser(userProfile);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
      await logout();
    }
  };

  const checkPermission = async (permission: string): Promise<boolean> => {
    if (!user || !currentTenant) return false;

    try {
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .eq('role', user.role)
        .eq('permission', permission)
        .eq('tenant_id', currentTenant.id)
        .single();

      if (error) return false;
      return !!data;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const setupAuth = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (initialSession?.user) {
          setSession(initialSession);
          const userProfile = await loadUserProfile(initialSession.user);
          setUser(userProfile);
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
          if (currentSession?.user) {
            setSession(currentSession);
            const userProfile = await loadUserProfile(currentSession.user);
            setUser(userProfile);
          } else {
            setUser(null);
            setSession(null);
          }

          if (event === 'SIGNED_OUT') {
            navigate('/login');
          }
        });

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error('Error setting up auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    setupAuth();
  }, [currentTenant]);

  // Implementações dos métodos de autenticação...
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data: { user, session }, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      console.log('Login attempt:', { user, error });

      if (error) {
        throw new Error(error.message === 'Invalid login credentials'
          ? 'Email ou senha incorretos'
          : error.message);
      }

      if (!user) throw new Error('Usuário não encontrado');

      const profile = await loadUserProfile(user);
      console.log('User profile loaded:', profile);
      
      setUser(profile);
      setSession(session);
      toast.success('Login realizado com sucesso!', {
        description: `Bem-vindo(a) ${profile?.full_name || 'de volta'}!`
      });
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login failed:', error);
      toast.error('Falha no login', { 
        description: error.message || 'Por favor, verifique suas credenciais e tente novamente'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      navigate('/login');
    } catch (error: any) {
      toast.error('Erro ao fazer logout', { description: error.message });
    }
  };

  const register = async ({ email, password, full_name }: {
    email: string;
    password: string;
    full_name: string
  }) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name } }
      });

      if (error) throw error;

      if (data.user) {
        await supabase.from('profiles').insert([
          { id: data.user.id, full_name, role: 'user', tenant_id: currentTenant?.id }
        ]);
        toast.success('Conta criada com sucesso!', {
          description: 'Você já pode fazer login com suas credenciais'
        });
        navigate('/login');
      }
    } catch (error: any) {
      const errorMessage = error.message.includes('Email already registered')
        ? 'Este email já está cadastrado'
        : 'Não foi possível criar sua conta. Tente novamente mais tarde';
      toast.error('Erro no cadastro', { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      toast.success('Email de recuperação enviado!', {
        description: 'Verifique sua caixa de entrada e siga as instruções'
      });
    } catch (error: any) {
      toast.error('Erro na recuperação de senha', { 
        description: 'Não foi possível enviar o email de recuperação. Verifique o endereço fornecido e tente novamente.'
      });
    }
  };

  const updateProfile = async (data: ProfileData) => {
    try {
      if (!user) throw new Error('Usuário não autenticado');
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);

      if (error) throw error;
      setUser(prev => prev ? { ...prev, ...data } : null);
      toast.success('Perfil atualizado!', {
        description: 'Suas informações foram salvas com sucesso'
      });
    } catch (error: any) {
      toast.error('Erro na atualização', { 
        description: 'Não foi possível atualizar seu perfil. Por favor, tente novamente.'
      });
    }
  };


  const hasRole = (requiredRole: string | string[]): boolean => {
    if (!user?.role) return false;
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role);
    }
    return user.role === requiredRole;
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isLoading,
      login,
      logout,
      register,
      resetPassword,
      updateProfile,
      hasRole,
      checkPermission,
      refreshSession
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};