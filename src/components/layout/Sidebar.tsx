
import { useState, useEffect } from 'react';
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
  X,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  // Verificar o tamanho da tela ao iniciar
  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    };
    
    // Verificação inicial
    checkScreenSize();
    
    // Adicionar listener para redimensionamento da janela
    window.addEventListener('resize', checkScreenSize);
    
    // Limpar o listener ao desmontar
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile Sidebar Toggle */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full shadow-md bg-background"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Desktop Sidebar Toggle Button */}
      <div className="fixed top-4 left-4 z-50 hidden lg:block" style={{ left: isCollapsed ? '3.5rem' : '15rem' }}>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleSidebar}
          className="rounded-full shadow-md bg-background"
        >
          {isCollapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed top-0 left-0 z-40 h-full bg-sidebar text-sidebar-foreground transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo area */}
        <div className="flex h-16 items-center px-4 border-b border-sidebar-accent/20 justify-center lg:justify-start">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Box className="h-6 w-6 text-sidebar-primary" />
            {!isCollapsed && <span className="text-xl font-bold">Fluxos</span>}
          </Link>
        </div>

        {/* Nav links */}
        <nav className={cn("py-4", isCollapsed ? "px-2" : "px-4", "space-y-1 overflow-y-auto")}>
          <div className="py-2">
            {!isCollapsed && (
              <p className="px-3 text-xs font-medium text-sidebar-foreground/60 uppercase mb-2">
                Principal
              </p>
            )}
            <div className="space-y-1">
              <Link
                to="/dashboard"
                className={cn(
                  "flex items-center gap-3 rounded-md py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isCollapsed ? "justify-center px-2" : "px-3",
                  isActive("/dashboard") && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                )}
                title="Dashboard"
              >
                <Home className="h-4 w-4" />
                {!isCollapsed && <span>Dashboard</span>}
              </Link>
              
              <Link
                to="/profile"
                className={cn(
                  "flex items-center gap-3 rounded-md py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isCollapsed ? "justify-center px-2" : "px-3",
                  isActive("/profile") && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                )}
                title="Meu Perfil"
              >
                <Users className="h-4 w-4" />
                {!isCollapsed && <span>Meu Perfil</span>}
              </Link>
            </div>
          </div>

          <div className="py-2">
            {!isCollapsed && (
              <p className="px-3 text-xs font-medium text-sidebar-foreground/60 uppercase mb-2">
                Operações
              </p>
            )}
            <div className="space-y-1">
              <Link
                to="/inventory"
                className={cn(
                  "flex items-center gap-3 rounded-md py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isCollapsed ? "justify-center px-2" : "px-3",
                  isActive("/inventory") && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                )}
                title="Produtos"
              >
                <PackageOpen className="h-4 w-4" />
                {!isCollapsed && <span>Produtos</span>}
              </Link>
              
              <Link
                to="/inventory/stock-movements"
                className={cn(
                  "flex items-center gap-3 rounded-md py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isCollapsed ? "justify-center px-2" : "px-3",
                  (location.pathname === "/inventory/stock-movements") && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                )}
                title="Movimentações"
              >
                <Box className="h-4 w-4" />
                {!isCollapsed && <span>Movimentações</span>}
              </Link>

              <Link
                to="/orders"
                className={cn(
                  "flex items-center gap-3 rounded-md py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isCollapsed ? "justify-center px-2" : "px-3",
                  isActive("/orders") && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                )}
                title="Ordens de Serviço"
              >
                <ClipboardList className="h-4 w-4" />
                {!isCollapsed && <span>Ordens de Serviço</span>}
              </Link>

              <Link
                to="/purchases"
                className={cn(
                  "flex items-center gap-3 rounded-md py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isCollapsed ? "justify-center px-2" : "px-3",
                  isActive("/purchases") && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                )}
                title="Compras"
              >
                <ShoppingCart className="h-4 w-4" />
                {!isCollapsed && <span>Compras</span>}
              </Link>

              <Link
                to="/clients-suppliers"
                className={cn(
                  "flex items-center gap-3 rounded-md py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isCollapsed ? "justify-center px-2" : "px-3",
                  isActive("/clients-suppliers") && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                )}
                title="Clientes/Fornecedores"
              >
                <Users className="h-4 w-4" />
                {!isCollapsed && <span>Clientes/Fornecedores</span>}
              </Link>
            </div>
          </div>

          <div className="py-2">
            {!isCollapsed && (
              <p className="px-3 text-xs font-medium text-sidebar-foreground/60 uppercase mb-2">
                Financeiro
              </p>
            )}
            <div className="space-y-1">
              <Link
                to="/invoices"
                className={cn(
                  "flex items-center gap-3 rounded-md py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isCollapsed ? "justify-center px-2" : "px-3",
                  isActive("/invoices") && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                )}
                title="Notas Fiscais"
              >
                <FileText className="h-4 w-4" />
                {!isCollapsed && <span>Notas Fiscais</span>}
              </Link>

              <Link
                to="/expenses"
                className={cn(
                  "flex items-center gap-3 rounded-md py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isCollapsed ? "justify-center px-2" : "px-3",
                  isActive("/expenses") && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                )}
                title="Despesas"
              >
                <CreditCard className="h-4 w-4" />
                {!isCollapsed && <span>Despesas</span>}
              </Link>

              <Link
                to="/financial/entries"
                className={cn(
                  "flex items-center gap-3 rounded-md py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isCollapsed ? "justify-center px-2" : "px-3",
                  isActive("/financial/entries") && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                )}
                title="Lançamentos"
              >
                <BarChart3 className="h-4 w-4" />
                {!isCollapsed && <span>Lançamentos</span>}
              </Link>

              <Link
                to="/financial/cash-flow"
                className={cn(
                  "flex items-center gap-3 rounded-md py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isCollapsed ? "justify-center px-2" : "px-3",
                  isActive("/financial/cash-flow") && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                )}
                title="Fluxo de Caixa"
              >
                <DollarSign className="h-4 w-4" />
                {!isCollapsed && <span>Fluxo de Caixa</span>}
              </Link>
            </div>
          </div>

          <div className="py-2">
            {!isCollapsed && (
              <p className="px-3 text-xs font-medium text-sidebar-foreground/60 uppercase mb-2">
                Sistema
              </p>
            )}
            <div className="space-y-1">
              <Link
                to="/settings"
                className={cn(
                  "flex items-center gap-3 rounded-md py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isCollapsed ? "justify-center px-2" : "px-3",
                  isActive("/settings") && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                )}
                title="Configurações"
              >
                <Settings className="h-4 w-4" />
                {!isCollapsed && <span>Configurações</span>}
              </Link>
              
              <button
                onClick={handleLogout}
                className={cn(
                  "w-full flex items-center gap-3 rounded-md py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isCollapsed ? "justify-center px-2" : "px-3"
                )}
                title="Sair"
              >
                <LogOut className="h-4 w-4" />
                {!isCollapsed && <span>Sair</span>}
              </button>
            </div>
          </div>
        </nav>

        {/* User info */}
        {!isCollapsed && (
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
        )}
        {isCollapsed && (
          <div className="absolute bottom-0 left-0 right-0 border-t border-sidebar-accent/20 p-2 flex justify-center">
            <div className="h-9 w-9 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-accent-foreground">
              {user?.full_name?.charAt(0) || '?'}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
