/**
 * Header - App title and primary navigation.
 */

type View = 'dashboard' | 'categories' | 'settings';

interface HeaderProps {
  /** Active view identifier for navigation state. */
  view: View;
  /** Handle navigation to a different view. */
  onViewChange: (view: View) => void;
}

const NAV_ITEMS: Array<{ id: View; label: string }> = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'categories', label: 'Categories' },
  { id: 'settings', label: 'Settings' },
];

export function Header({ view, onViewChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <span className="inline-flex rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary-700">
              Asset Intelligence Workspace
            </span>
            <div>
              <p className="text-xl font-semibold text-slate-950 sm:text-2xl">
                Asset Portfolio Visualization
              </p>
              <p className="max-w-2xl text-sm text-slate-600">
                Track category exposure, underlying positions, and portfolio composition in a
                cleaner operating view.
              </p>
            </div>
          </div>
          <nav
            className="grid grid-cols-3 gap-1.5 rounded-2xl border border-slate-200 bg-slate-100/80 p-1.5 sm:min-w-[320px]"
            aria-label="Primary"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = view === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onViewChange(item.id)}
                  className={`min-h-[44px] min-w-[44px] rounded-xl px-4 py-2.5 text-center text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    isActive
                      ? 'border border-white bg-white text-slate-950 shadow-sm'
                      : 'border border-transparent text-slate-600 hover:bg-white/70 hover:text-slate-900'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
