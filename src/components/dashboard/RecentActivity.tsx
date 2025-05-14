
import { Activity } from "@/types/activity";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Package2, ClipboardList, ShoppingCart, BarChart3, FileText } from "lucide-react";

interface RecentActivityProps {
  activities: Activity[];
}

export const RecentActivity = ({ activities }: RecentActivityProps) => {
  // Function to determine the icon based on activity type
  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "inventory":
        return <Package2 className="h-5 w-5" />;
      case "order":
        return <ClipboardList className="h-5 w-5" />;
      case "purchase":
        return <ShoppingCart className="h-5 w-5" />;
      case "expense":
        return <BarChart3 className="h-5 w-5" />;
      case "invoice":
        return <FileText className="h-5 w-5" />;
      default:
        return <Package2 className="h-5 w-5" />;
    }
  };

  // Function to determine color based on activity type
  const getActivityColor = (type: Activity["type"]) => {
    switch (type) {
      case "inventory":
        return "bg-blue-100 text-blue-600";
      case "order":
        return "bg-green-100 text-green-600";
      case "purchase":
        return "bg-purple-100 text-purple-600";
      case "expense":
        return "bg-red-100 text-red-600";
      case "invoice":
        return "bg-amber-100 text-amber-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="space-y-8">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start">
          <div className={`p-2 rounded-full mr-4 ${getActivityColor(activity.type)}`}>
            {getActivityIcon(activity.type)}
          </div>
          <div className="flex-1">
            <div className="font-medium">{activity.description}</div>
            <div className="text-sm text-muted-foreground mt-1">
              Por {activity.user} • {formatDistanceToNow(activity.timestamp, { addSuffix: true, locale: ptBR })}
            </div>
          </div>
        </div>
      ))}

      {activities.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          Nenhuma atividade recente.
        </div>
      )}
    </div>
  );
};
