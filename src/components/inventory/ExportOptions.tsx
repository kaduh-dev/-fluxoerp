
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileText } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface ExportOptionsProps {
  data: any[];
  filename?: string;
}

export const ExportOptions = ({ data, filename = "produtos" }: ExportOptionsProps) => {
  const handleExportCSV = () => {
    try {
      if (!data || data.length === 0) {
        toast.error("Não há dados para exportar");
        return;
      }

      // Get headers from first object keys
      const headers = Object.keys(data[0]);
      
      // Convert data to CSV
      const csvRows = [];
      csvRows.push(headers.join(","));
      
      for (const row of data) {
        const values = headers.map(header => {
          const value = row[header];
          return typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value;
        });
        csvRows.push(values.join(","));
      }

      const csvContent = csvRows.join("\n");
      
      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      
      // Create hidden link and trigger download
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Arquivo CSV exportado com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar CSV:", error);
      toast.error("Erro ao exportar o arquivo");
    }
  };

  const handleExportPDF = () => {
    // In a real implementation, we would use a library like jsPDF
    // For now, we'll just show a toast message
    toast.info("Exportação de PDF em desenvolvimento");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <FileText className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportCSV}>
          Exportar como CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPDF}>
          Exportar como PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
