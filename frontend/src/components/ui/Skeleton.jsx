import { cn } from '../../lib/utils';

export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn("animate-pulse rounded-2xl bg-apple-surface/60", className)}
      {...props}
    />
  );
};
