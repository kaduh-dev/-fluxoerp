
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileText, Download } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface ExportOptionsProps {
  data: any[];
  filename?: string;
}

export function ExportOptions({ data, filename = "export" }: ExportOptionsProps) {
  const exportToCSV = () => {
    try {
      if (!data || data.length === 0) {
        toast.error("Não há dados para exportar");
        return;
      }

      // Gerar cabeçalho
      const headers = Object.keys(data[0]);
      let csvContent = headers.join(",") + "\n";

      // Gerar linhas de dados
      data.forEach(item => {
        const row = headers.map(header => {
          const value = item[header] !== null && item[header] !== undefined ? item[header] : '';
          // Escapar aspas e valores com vírgula
          return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
            ? `"${value.replace(/"/g, '""')}"` 
            : String(value);
        });
        csvContent += row.join(",") + "\n";
      });

      // Criar e baixar o arquivo
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${filename}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Arquivo CSV exportado com sucesso");
    } catch (error) {
      console.error("Erro ao exportar para CSV:", error);
      toast.error("Erro ao exportar dados");
    }
  };

  const exportToPDF = () => {
    // Simulação - em um ambiente real, você usaria uma biblioteca como jsPDF
    toast.success("Exportação para PDF será implementada em breve");
  };

  const exportToExcel = () => {
    // Simulação - em um ambiente real, você usaria uma biblioteca como xlsx
    toast.success("Exportação para Excel será implementada em breve");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToCSV}>
          <FileText className="mr-2 h-4 w-4" />
          CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToExcel}>
          <FileText className="mr-2 h-4 w-4" />
          Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPDF}>
          <FileText className="mr-2 h-4 w-4" />
          PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
