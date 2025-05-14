
-- Create permissions table
CREATE TABLE public.permissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID REFERENCES public.tenants(id) NOT NULL,
    role VARCHAR NOT NULL,
    permission VARCHAR NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, role, permission)
);

-- Enable RLS
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their tenant permissions" ON public.permissions
    FOR SELECT
    USING (tenant_id = get_current_tenant_id());

-- Insert some default permissions
INSERT INTO public.permissions (tenant_id, role, permission) VALUES
    (get_current_tenant_id(), 'admin', 'can_manage_users'),
    (get_current_tenant_id(), 'admin', 'can_view_finance'),
    (get_current_tenant_id(), 'admin', 'can_manage_inventory'),
    (get_current_tenant_id(), 'user', 'can_view_inventory'),
    (get_current_tenant_id(), 'user', 'can_create_orders');
