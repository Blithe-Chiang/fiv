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
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary-600">Asset Portfolio Visualization</h1>
            <p className="text-sm text-gray-600">Track, categorize, and visualize your assets</p>
          </div>
          <nav className="flex flex-wrap gap-2" aria-label="Primary">
            {NAV_ITEMS.map((item) => {
              const isActive = view === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onViewChange(item.id)}
                  className={`min-h-[44px] min-w-[44px] rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
