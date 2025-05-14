-- Create tenants table
CREATE TABLE public.tenants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

-- Create users table (this will work alongside Supabase Auth)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    email VARCHAR NOT NULL,
    tenant_id UUID REFERENCES public.tenants(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Function to set tenant_id
CREATE OR REPLACE FUNCTION public.set_tenant_id(id uuid)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.tenant_id', id::text, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current tenant_id
CREATE OR REPLACE FUNCTION public.get_current_tenant_id()
RETURNS uuid AS $$
BEGIN
  RETURN current_setting('app.tenant_id', true)::uuid;
END;
$$ LANGUAGE plpgsql STABLE;

-- Create RLS policies
CREATE POLICY "Users can view their own tenant data" ON public.users
    FOR SELECT
    USING (auth.uid() = id OR tenant_id = get_current_tenant_id());

CREATE POLICY "Users can only insert into their tenant" ON public.users
    FOR INSERT
    WITH CHECK (tenant_id = get_current_tenant_id());

CREATE POLICY "Users can update their own data" ON public.users
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (tenant_id = get_current_tenant_id());

-- Add policies for existing tables
ALTER TABLE public.clients_suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant access for clients_suppliers" ON public.clients_suppliers
    FOR ALL USING (tenant_id = get_current_tenant_id());

CREATE POLICY "Tenant access for purchase_requests" ON public.purchase_requests
    FOR ALL USING (tenant_id = get_current_tenant_id());

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    full_name TEXT,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Create updated policies
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow users to insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view all profiles in their tenant"
    ON public.profiles FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.users 
        WHERE users.tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid())
    ));

CREATE OR REPLACE FUNCTION public.init_profile_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    full_name TEXT,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
  );
END;
$$ LANGUAGE plpgsql;