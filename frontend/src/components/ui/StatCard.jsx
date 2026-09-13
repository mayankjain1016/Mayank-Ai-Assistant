import { cn } from '../../lib/utils';
import { Skeleton } from './Skeleton';

export const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  colorClass = "text-indigo-400",
  bgClass = "bg-indigo-500/10",
  loading = false
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800/60 rounded-2xl p-5 sm:p-6 shadow-sm hover:border-slate-700/80 transition-colors flex items-start gap-4">
      <div className={cn("p-3 rounded-xl shrink-0 transition-colors", bgClass, colorClass)}>
        <Icon size={24} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-slate-400 text-sm font-medium truncate mb-1">{title}</p>
        {loading ? (
          <Skeleton className="h-8 w-20 mt-1" />
        ) : (
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-50 tracking-tight truncate">
            {value}
          </h3>
        )}
      </div>
    </div>
  );
};
