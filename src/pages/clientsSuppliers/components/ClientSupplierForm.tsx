import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import {
  ClientSupplier,
  ClientSupplierType,
  ClientSupplierStatus,
} from "@/types/clientSupplier";
import { useTenant } from "@/contexts/TenantContext";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the form schema with validation
const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  cnpj_cpf: z.string().min(1, "CNPJ/CPF é obrigatório"), // Não mais opcional
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email("Email inválido").optional().nullable(),
  type: z.enum(["client", "supplier", "both"]),
  status: z.enum(["active", "inactive"]),
  notes: z.string().optional().nullable(),
});

type FormData = z.infer<typeof formSchema>;

interface ClientSupplierFormProps {
  initialData: ClientSupplier | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ClientSupplierForm = ({
  initialData,
  onSuccess,
  onCancel,
}: ClientSupplierFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { currentTenant } = useTenant();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          address: initialData.address || "",
          city: initialData.city || "",
          state: initialData.state || "",
          phone: initialData.phone || "",
          email: initialData.email || "",
          notes: initialData.notes || "",
        }
      : {
          name: "",
          cnpj_cpf: "",
          address: "",
          city: "",
          state: "",
          phone: "",
          email: "",
          type: "client" as ClientSupplierType,
          status: "active" as ClientSupplierStatus,
          notes: "",
        },
  });

  const onSubmit = async (data: FormData) => {
    if (!currentTenant) {
      toast({
        title: "Erro",
        description: "Tenant não encontrado.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      // Verificar se já existe um registro com o mesmo CNPJ/CPF
      const { data: existingData, error: checkError } = await supabase
        .from("clients_suppliers")
        .select("id")
        .eq("cnpj_cpf", data.cnpj_cpf)
        .eq("tenant_id", currentTenant.id);
      if (
        existingData &&
        existingData.length > 0 &&
        (!initialData || existingData[0].id !== initialData.id)
      ) {
        toast({
          title: "CNPJ/CPF já cadastrado",
          description: "Já existe um cliente ou fornecedor com este documento.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      let result;
      if (initialData) {
        // Atualizar cliente/fornecedor existente
        result = await supabase
          .from("clients_suppliers")
          .update({
            ...data,
            address: data.address || null,
            city: data.city || null,
            state: data.state || null,
            phone: data.phone || null,
            email: data.email || null,
            notes: data.notes || null,
          })
          .eq("id", initialData.id)
          .eq("tenant_id", currentTenant.id) // Garantindo que estamos atualizando no tenant correto
          .select();
      } else {
        // Criar novo cliente/fornecedor
        result = await supabase
          .from("clients_suppliers")
          .insert({
            ...data,
            address: data.address || null,
            city: data.city || null,
            state: data.state || null,
            phone: data.phone || null,
            email: data.email || null,
            notes: data.notes || null,
            tenant_id: currentTenant.id, // Associar ao tenant correto
          })
          .select();
      }
      if (result.error) {
        throw result.error;
      }
      toast({
        title: initialData ? "Registro atualizado" : "Registro criado",
        description: initialData
          ? "As informações foram atualizadas com sucesso."
          : "O novo cliente/fornecedor foi cadastrado com sucesso.",
      });
      onSuccess();
    } catch (error: any) {
      console.error("Error saving client/supplier:", error);
      toast({
        title: "Erro ao salvar",
        description:
          error.message || "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            {initialData
              ? "Editar Cliente/Fornecedor"
              : "Novo Cliente/Fornecedor"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome/Razão Social*</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cnpj_cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CNPJ/CPF*</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o documento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o email"
                      type="email"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o telefone"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite o endereço"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite a cidade"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o estado"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo*</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="client">Cliente</SelectItem>
                      <SelectItem value="supplier">Fornecedor</SelectItem>
                      <SelectItem value="both">Ambos</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status*</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observações</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Adicione observações sobre este cliente/fornecedor"
                    rows={3}
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            type="button"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? "Salvando..."
              : initialData
                ? "Atualizar"
                : "Cadastrar"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
