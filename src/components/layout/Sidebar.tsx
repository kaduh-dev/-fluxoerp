import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Box, 
  ClipboardList, 
  FileText, 
  Home, 
  LogOut, 
  Menu, 
  PackageOpen, 
  Settings, 
  ShoppingCart, 
  Users, 
  X 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { supabase } from '@/lib/supabase'; // Import supabase

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isActive: boolean;
  isCollapsed: boolean;
}

const SidebarItem = ({ icon: Icon, label, href, isActive, isCollapsed }: SidebarItemProps) => {
  return (
    <Link to={href} className="w-full">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2 px-3 py-6 h-auto rounded-md",
          isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground/80",
          isCollapsed ? "justify-center p-2" : ""
        )}
      >
        <Icon className={cn("h-5 w-5", isCollapsed ? "mx-auto" : "")} />
        {!isCollapsed && <span>{label}</span>}
      </Button>
    </Link>
  );
};

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // Use useNavigate for redirection

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <div 
      className={cn(
        "bg-sidebar h-screen flex flex-col border-r border-sidebar-border transition-all duration-300 ease-in-out sticky top-0",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center">
            <Box className="h-6 w-6 text-sidebar-primary" />
            <span className="text-sidebar-foreground font-bold ml-2">FluxoERP</span>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex flex-col gap-1 p-2 flex-1 overflow-y-auto">
        <SidebarItem icon={Home} label="Dashboard" href="/" isActive={location.pathname === '/'} isCollapsed={isCollapsed} />
        <SidebarItem icon={PackageOpen} label="Estoque" href="/inventory" isActive={isActive('/inventory')} isCollapsed={isCollapsed} />
        <SidebarItem icon={ClipboardList} label="Ordens de Serviço" href="/orders" isActive={isActive('/orders')} isCollapsed={isCollapsed} />
        <SidebarItem icon={ShoppingCart} label="Compras" href="/purchases" isActive={isActive('/purchases')} isCollapsed={isCollapsed} />
        <SidebarItem icon={Users} label="Clientes/Fornecedores" href="/clients-suppliers" isActive={isActive('/clients-suppliers')} isCollapsed={isCollapsed} />
        <SidebarItem icon={FileText} label="Notas Fiscais" href="/invoices" isActive={isActive('/invoices')} isCollapsed={isCollapsed} />
        <SidebarItem icon={BarChart3} label="Financeiro" href="/expenses" isActive={isActive('/expenses')} isCollapsed={isCollapsed} />
        <SidebarItem icon={Users} label="Usuários" href="/users" isActive={isActive('/users')} isCollapsed={isCollapsed} />
      </div>

      <div className="p-2 border-t border-sidebar-border">
        <SidebarItem icon={Settings} label="Configurações" href="/settings" isActive={isActive('/settings')} isCollapsed={isCollapsed} />
        <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-2 px-3 py-6 h-auto rounded-md text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              isCollapsed ? "justify-center p-2" : ""
            )}
            onClick={async () => {
              await supabase.auth.signOut();
              navigate('/login');
            }}
          >
            <LogOut className={cn("h-5 w-5", isCollapsed ? "mx-auto" : "")} />
            {!isCollapsed && <span>Sair</span>}
          </Button>
      </div>
    </div>
  );
};