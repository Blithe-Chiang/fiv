/**
 * Layout - Main layout wrappers.
 */

import { Header } from './Header';

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
      <Header view={view} onViewChange={onViewChange} />
      {/* Main Content */}
      <main className="py-6">{children}</main>
    </div>
  );
}
