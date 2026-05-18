interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  trailingSlot?: React.ReactNode;
}

export function GlassInput({ label, error, icon, trailingSlot, className = '', ...props }: GlassInputProps) {
  const hasTrailingSlot = Boolean(trailingSlot);

  return (
    <div className="w-full relative">
      {label && (
        <label className="block mb-2 text-gray-200 text-sm font-medium">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          className={`w-full ${icon ? 'pl-12' : 'px-4'} ${hasTrailingSlot ? 'pr-24' : ''} py-3 glass rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${className}`}
          {...props}
        />
        {trailingSlot && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
            {trailingSlot}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
