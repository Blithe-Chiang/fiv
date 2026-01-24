/**
 * Layout - Main layout with navigation
 */

interface LayoutProps {
  children: React.ReactNode;
}

type View = 'dashboard' | 'categories' | 'settings';

interface LayoutWithNavigationProps {
  view: View;
  onViewChange: (view: View) => void;
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}

export function LayoutWithNavigation({ view, onViewChange, children }: LayoutWithNavigationProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Navigation */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary-600">Asset Portfolio Visualization</h1>
            <nav className="flex gap-2">
              <button
                onClick={() => onViewChange('dashboard')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  view === 'dashboard'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => onViewChange('categories')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  view === 'categories'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Categories
              </button>
              <button
                onClick={() => onViewChange('settings')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  view === 'settings'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Settings
              </button>
            </nav>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
