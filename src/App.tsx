import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { CategoryManagement } from './components/category/CategoryManagement';
import { Settings } from './components/settings/Settings';
import { LayoutWithNavigation } from './components/layout/Layout';

type View = 'dashboard' | 'categories' | 'settings';

function App() {
  const [view, setView] = useState<View>('dashboard');

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard />;
      case 'categories':
        return <CategoryManagement />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <LayoutWithNavigation view={view} onViewChange={setView}>
      {renderView()}
    </LayoutWithNavigation>
  );
}

export default App;
