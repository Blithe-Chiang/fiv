/**
 * Button component with variants
 */

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const baseClasses =
    'inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold tracking-[0.01em] transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

  const variantClasses = {
    primary:
      'border-primary-700 bg-primary-600 text-white shadow-[0_18px_36px_-24px_rgba(37,99,235,0.8)] hover:border-primary-800 hover:bg-primary-700 focus:ring-primary-500',
    secondary:
      'border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50 focus:ring-slate-400',
    danger:
      'border-red-700 bg-red-600 text-white shadow-[0_18px_36px_-24px_rgba(220,38,38,0.65)] hover:border-red-800 hover:bg-red-700 focus:ring-red-500',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
