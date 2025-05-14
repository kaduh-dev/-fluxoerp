
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";

interface InventoryFiltersProps {
  categories: string[];
  onFilterChange: (filters: {
    search: string;
    category: string;
    status: string;
  }) => void;
}

export const InventoryFilters = ({
  categories,
  onFilterChange,
}: InventoryFiltersProps) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    onFilterChange({ search: value, category, status });
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    onFilterChange({ search, category: value, status });
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    onFilterChange({ search, category, status: value });
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setStatus("all");
    onFilterChange({ search: "", category: "all", status: "all" });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between w-full">
      <div className="flex flex-1 w-full gap-4 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou SKU..."
            className="pl-10"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex gap-2 sm:w-auto w-full">
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Categorias</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Status</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="low">Baixo</SelectItem>
              <SelectItem value="out">Esgotado</SelectItem>
            </SelectContent>
          </Select>

          {(search || category !== "all" || status !== "all") && (
            <Button
              variant="outline"
              size="icon"
              onClick={clearFilters}
              title="Limpar filtros"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
