/**
 * Input component with validation state
 */

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  const inputClasses = `
    w-full min-h-[48px] rounded-xl border bg-white/95 px-4 py-3 text-slate-900 shadow-sm transition
    placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
    ${error ? 'border-red-400' : 'border-slate-200'}
    ${className}
  `;

  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input className={inputClasses} {...props} />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
