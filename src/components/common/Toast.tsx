/**
 * ToastProvider - Simple toast notification system.
 */

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

type ToastVariant = 'success' | 'error';

interface Toast {
  id: string;
  title: string;
  message?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  addToast: (toast: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

function createToastId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = createToastId();
    setToasts((current) => [...current, { ...toast, id }]);

    window.setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, [removeToast]);

  const value = useMemo(() => ({ addToast }), [addToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[60] space-y-2" aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`min-w-[260px] rounded-lg border px-4 py-3 shadow-lg ${
              toast.variant === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                : 'border-red-200 bg-red-50 text-red-900'
            }`}
            role="status"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.message && (
                  <p
                    className={`text-sm ${
                      toast.variant === 'success' ? 'text-emerald-800' : 'text-red-800'
                    }`}
                  >
                    {toast.message}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className={`min-h-[44px] min-w-[44px] rounded-md text-current hover:text-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  toast.variant === 'success' ? 'focus:ring-emerald-400' : 'focus:ring-red-400'
                }`}
                aria-label="Dismiss notification"
              >
                <svg className="h-5 w-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/**
 * useToast - Access toast notification helpers.
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return {
    success: (title: string, message?: string) =>
      context.addToast({ title, message, variant: 'success' }),
    error: (title: string, message?: string) =>
      context.addToast({ title, message, variant: 'error' }),
  };
}
