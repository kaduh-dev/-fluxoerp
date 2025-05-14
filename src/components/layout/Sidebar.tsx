
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
  DollarSign,
  CreditCard,
  X 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <>
      {/* Mobile Sidebar Toggle */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed top-0 left-0 z-40 h-full w-64 bg-sidebar text-sidebar-foreground transition-transform",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        {/* Logo area */}
        <div className="flex h-16 items-center px-4 border-b border-sidebar-accent/20">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Box className="h-6 w-6 text-sidebar-primary" />
            <span className="text-xl font-bold">Fluxos</span>
          </Link>
        </div>

        {/* Nav links */}
        <nav className="p-4 space-y-1">
          <div className="py-2">
            <p className="px-3 text-xs font-medium text-sidebar-foreground/60 uppercase mb-2">
              Principal
            </p>
            <div className="space-y-1">
              <Link
                to="/dashboard"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive("/dashboard") && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                )}
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              
              <Link
                to="/profile"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive("/profile") && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                )}
              >
                <Users className="h-4 w-4" />
                <span>Meu Perfil</span>
              </Link>
            </div>
          </div>

          <div className="py-2">
            <p className="px-3 text-xs font-medium text-sidebar-foreground/60 uppercase mb-2">
              Operações
            </p>
            <div className="space-y-1">
              <Link
                to="/inventory"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive("/inventory") && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                )}
              >
                <PackageOpen className="h-4 w-4" />
                <span>Produtos</span>
              </Link>
              
              <Link
                to="/inventory/stock-movements"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive("/inventory/stock-movements") && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                )}
              >
                <Box className="h-4 w-4" />
                <span>Movimentações</span>
              </Link>

              <Link
                to="/orders"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive("/orders") && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                )}
              >
                <ClipboardList className="h-4 w-4" />
                <span>Ordens de Serviço</span>
              </Link>

              <Link
                to="/purchases"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive("/purchases") && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                )}
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Compras</span>
              </Link>

              <Link
                to="/clients-suppliers"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive("/clients-suppliers") && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                )}
              >
                <Users className="h-4 w-4" />
                <span>Clientes/Fornecedores</span>
              </Link>
            </div>
          </div>

          <div className="py-2">
            <p className="px-3 text-xs font-medium text-sidebar-foreground/60 uppercase mb-2">
              Financeiro
            </p>
            <div className="space-y-1">
              <Link
                to="/invoices"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive("/invoices") && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                )}
              >
                <FileText className="h-4 w-4" />
                <span>Notas Fiscais</span>
              </Link>

              <Link
                to="/expenses"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive("/expenses") && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                )}
              >
                <CreditCard className="h-4 w-4" />
                <span>Despesas</span>
              </Link>

              <Link
                to="/financial/entries"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive("/financial/entries") && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                )}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Lançamentos</span>
              </Link>

              <Link
                to="/financial/cash-flow"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive("/financial/cash-flow") && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                )}
              >
                <DollarSign className="h-4 w-4" />
                <span>Fluxo de Caixa</span>
              </Link>
            </div>
          </div>

          <div className="py-2">
            <p className="px-3 text-xs font-medium text-sidebar-foreground/60 uppercase mb-2">
              Sistema
            </p>
            <div className="space-y-1">
              <Link
                to="/settings"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive("/settings") && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                )}
              >
                <Settings className="h-4 w-4" />
                <span>Configurações</span>
              </Link>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </nav>

        {/* User info */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-sidebar-accent/20 p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-accent-foreground">
              {user?.full_name?.charAt(0) || '?'}
            </div>
            <div className="truncate">
              <p className="text-sm font-medium">{user?.full_name || 'Usuário'}</p>
              <p className="text-xs text-sidebar-foreground/70">{user?.email || ''}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
