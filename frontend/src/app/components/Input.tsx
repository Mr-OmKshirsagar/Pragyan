interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  trailingSlot?: React.ReactNode;
}

export function Input({ label, error, className = '', trailingSlot, ...props }: InputProps) {
  const hasTrailingSlot = Boolean(trailingSlot);

  return (
    <div className="w-full relative">
      {label && (
        <label className="block mb-2 text-[#0F172A]">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2 border border-[#E2E8F0] rounded-lg bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all ${hasTrailingSlot ? 'pr-24' : ''} ${className}`}
        {...props}
      />
      {trailingSlot && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
          {trailingSlot}
        </div>
      )}
      {error && (
        <p className="mt-1 text-sm text-[#EF4444]">{error}</p>
      )}
    </div>
  );
}
