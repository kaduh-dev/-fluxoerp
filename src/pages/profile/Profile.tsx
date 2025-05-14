import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface ProfileFormData {
  full_name: string;
  role: string;
  keep_admin: boolean;
}

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, setValue, watch } = useForm<ProfileFormData>();
  const selectedRole = watch('role');

  useEffect(() => {
    if (user) {
      setValue('full_name', user.full_name || '');
      setValue('role', user.role || 'user');
    }
  }, [user, setValue]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true);
      await updateProfile({
        full_name: data.full_name,
        role: data.role,
        admin_override: data.keep_admin
      });
      toast.success('Perfil atualizado com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao atualizar perfil', { description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Configurações do Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nome Completo</label>
                <Input {...register('full_name')} />
              </div>

              <div>
                <label className="text-sm font-medium">Email</label>
                <Input value={user?.email} disabled />
              </div>

              <div>
                <label className="text-sm font-medium">Cargo</label>
                <Select onValueChange={(value) => setValue('role', value)} defaultValue={user?.role}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="manager">Gestor</SelectItem>
                    <SelectItem value="financial">Financeiro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedRole === 'admin' && (
                <div className="flex items-center space-x-2">
                  <Checkbox id="keep_admin" {...register('keep_admin')} />
                  <label htmlFor="keep_admin" className="text-sm">
                    Manter acesso administrativo temporário
                  </label>
                </div>
              )}

              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}