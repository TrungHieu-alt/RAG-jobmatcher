// CandidatePage.tsx
import { useState, useEffect } from 'react';
import Topbar from './candidateComponents/Topbar';
import Dashboard from './candidateComponents/Dashboard';
import MyCVs from './candidateComponents/MyCVs';
import AppliedJobs from './candidateComponents/AppliedJobs';
import CreateCV from './candidateComponents/CreateCV';
import Settings from './candidateComponents/Settings';

export default function CandidatePage() {
  const [activePage, setActivePage] = useState('dashboard');
  const [isDark, setIsDark] = useState(false);
  const [previousPage, setPreviousPage] = useState('my-cvs');

  useEffect(() => {
    const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(darkModePreference);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleNavigateToCreateCV = () => {
    setPreviousPage('my-cvs');
    setActivePage('create-cv');
  };

  const handleBackFromCreateCV = () => {
    setActivePage(previousPage);
  };

  const handleNavigate = (page: string) => {
    if (page !== 'create-cv') {
      setActivePage(page);
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'my-cvs':
        return <MyCVs onNavigateToCreateCV={handleNavigateToCreateCV} />;
      case 'applied-jobs':
        return <AppliedJobs />;
      case 'create-cv':
        return <CreateCV onNavigateBack={handleBackFromCreateCV} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Topbar 
        activePage={activePage}
        onNavigate={handleNavigate}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />
      
      <main className="pt-5 p-6">
        <div className="max-w-7xl mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}