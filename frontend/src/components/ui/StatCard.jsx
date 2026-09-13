import { cn } from '../../lib/utils';
import { Skeleton } from './Skeleton';

export const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  colorClass = "text-black",
  bgClass = "bg-gray-100",
  loading = false
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:border-gray-300 transition-colors flex items-start gap-4">
      <div className={cn("p-3 rounded-xl shrink-0 transition-colors", bgClass, colorClass)}>
        <Icon size={24} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-gray-500 text-sm font-medium truncate mb-1">{title}</p>
        {loading ? (
          <Skeleton className="h-8 w-20 mt-1" />
        ) : (
          <h3 className="text-2xl sm:text-3xl font-bold text-black tracking-tight truncate">
            {value}
          </h3>
        )}
      </div>
    </div>
  );
};

