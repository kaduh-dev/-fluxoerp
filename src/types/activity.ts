
export type ActivityType = 'inventory' | 'order' | 'purchase' | 'invoice' | 'expense';

export interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  user: string;
  timestamp: Date;
}
