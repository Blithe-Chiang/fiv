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
  return <div className="min-h-screen bg-transparent">{children}</div>;
}

export function LayoutWithNavigation({ view, onViewChange, children }: LayoutWithNavigationProps) {
  return (
    <div className="min-h-screen bg-transparent">
      <Header view={view} onViewChange={onViewChange} />
      <main className="pb-10 pt-6 sm:pt-8 lg:pb-14 lg:pt-10">{children}</main>
    </div>
  );
}
