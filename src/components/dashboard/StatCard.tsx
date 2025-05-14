
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  onClick?: () => void;
}

export const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend, 
  className,
  onClick 
}: StatCardProps) => {
  return (
    <Card 
      className={cn("h-full", onClick && "hover:border-primary/50 transition-all", className)} 
      onClick={onClick}
    >
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-muted-foreground text-sm">{title}</p>
            <p className="text-2xl font-semibold mt-1">{value}</p>
          </div>
          <div className="p-3 rounded-full bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>

        {(description || trend) && (
          <div className="mt-auto pt-4 flex items-center justify-between">
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
            
            {trend && (
              <div className={cn(
                "flex items-center text-sm gap-1",
                trend.isPositive ? "text-green-500" : "text-red-500"
              )}>
                <span>{trend.isPositive ? '+' : ''}{trend.value}%</span>
                {trend.isPositive ? (
                  <div className="h-0 w-0 border-l-4 border-l-transparent border-b-4 border-b-green-500 border-r-4 border-r-transparent" />
                ) : (
                  <div className="h-0 w-0 border-l-4 border-l-transparent border-t-4 border-t-red-500 border-r-4 border-r-transparent" />
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
