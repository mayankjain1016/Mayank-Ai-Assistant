export const PageHeader = ({ title, description, children }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-50 tracking-tight">{title}</h1>
        {description && (
          <p className="text-slate-400 mt-1.5 text-sm sm:text-base">{description}</p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {children}
        </div>
      )}
    </div>
  );
};
