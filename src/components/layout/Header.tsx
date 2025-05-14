import { ReactNode, useState } from 'react';
import { Bell, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  title: string;
  children?: ReactNode;
}

export function Header({ title, children }: HeaderProps) {
  const { user } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-4 md:px-6 relative">
      {/* Título na versão desktop */}
      <h1 className={`text-lg md:text-xl font-semibold ${isSearchOpen ? 'hidden md:block' : 'block'}`}>{title}</h1>

      {/* Barra de pesquisa em tela cheia para mobile */}
      {isSearchOpen && (
        <div className="absolute inset-0 bg-white flex items-center px-2 md:hidden z-10">
          <Input 
            type="search" 
            placeholder="Pesquisar..." 
            className="flex-1 mx-2"
            autoFocus
          />
          <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
            <X size={20} />
          </Button>
        </div>
      )}

      <div className="flex items-center gap-2 md:gap-4">
        {/* Ícone de pesquisa em dispositivos móveis */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden" 
          onClick={() => setIsSearchOpen(true)}
        >
          <Search size={20} />
        </Button>

        {/* Barra de pesquisa em desktop */}
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            type="search" 
            placeholder="Pesquisar..." 
            className="pl-8 w-full"
          />
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1.5 flex h-2 w-2 rounded-full bg-red-500"></span>
        </Button>

        {children}
      </div>
    </header>
  );
}