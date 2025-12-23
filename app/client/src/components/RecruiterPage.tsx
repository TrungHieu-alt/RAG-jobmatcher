// RecruiterPage.tsx
import { useState, useEffect } from 'react';
import { Topbar } from './recruiterComponents/Topbar';
import { Dashboard } from './recruiterComponents/Dashboard';
import { JobPosts } from './recruiterComponents/JobPosts';
import { MatchingTracker } from './recruiterComponents/MatchingTracker';
import { CandidateManager } from './recruiterComponents/CandidateManager';
import { Analytics } from './recruiterComponents/Analytics';
import { Settings } from './recruiterComponents/Settings';

export default function RecruiterPage() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [previousPage, setPreviousPage] = useState('jobs');

  useEffect(() => {
    const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(darkModePreference);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleNavigateToCreateJob = () => {
    setPreviousPage('matching');
    setCurrentPage('create-job');
  };

  const handleBackFromCreateJob = () => {
    setCurrentPage(previousPage);
  };

  const handleNavigate = (page: string) => {
    if (page !== 'create-job') {
      setCurrentPage(page);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'jobs':
        return <JobPosts />;
      case 'matching':
        return <MatchingTracker onNavigateToCreateJob={handleNavigateToCreateJob} />;
      case 'candidates':
        return <CandidateManager />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      case 'create-job':
        return <JobPosts onNavigateBack={handleBackFromCreateJob} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Topbar 
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
      />

      <main className="p-8">
        <div className="max-w-7xl mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}