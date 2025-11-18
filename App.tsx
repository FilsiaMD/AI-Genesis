
import React, { useState } from 'react';
import { featuresData } from './constants';
import { Sidebar } from './components/PhaseCard';
import { Dashboard } from './components/Roadmap';
import { CareerAssessment } from './components/CareerAssessment';
import { ResumeGenerator } from './components/ResumeGenerator';
import { JobMatching } from './components/JobMatching';
import { VideoInterviewAnalyzer } from './components/VideoInterviewAnalyzer';
import { SalaryPrediction } from './components/SalaryPrediction';
import { PersonalizedUpskilling } from './components/PersonalizedUpskilling';
import { EnterpriseDashboard } from './components/EnterpriseDashboard';
import { SkillsAnalytics } from './components/SkillsAnalytics';
import { TalentMobilityEngine } from './components/TalentMobilityEngine';
import { CareerMarketplace } from './components/CareerMarketplace';
import { ApiIntegrations } from './components/ApiIntegrations';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeFeature = featuresData.find(f => f.id === activePage);

  const renderContent = () => {
    if (activePage === 'dashboard') {
      return <Dashboard setActivePage={setActivePage} />;
    }
    if (activePage === 'assessment') {
      return <CareerAssessment />;
    }
    if (activePage === 'resume') {
        return <ResumeGenerator />;
    }
    if (activePage === 'job-matching') {
        return <JobMatching />;
    }
    if (activePage === 'interviews') {
        return <VideoInterviewAnalyzer />;
    }
    if (activePage === 'salary') {
        return <SalaryPrediction />;
    }
    if (activePage === 'upskilling') {
        return <PersonalizedUpskilling />;
    }
    if (activePage === 'enterprise') {
        return <EnterpriseDashboard />;
    }
    if (activePage === 'analytics') {
        return <SkillsAnalytics />;
    }
    if (activePage === 'mobility') {
        return <TalentMobilityEngine />;
    }
    if (activePage === 'marketplace') {
        return <CareerMarketplace />;
    }
    if (activePage === 'api') {
        return <ApiIntegrations />;
    }
    // Fallback for any page that doesn't have a custom component yet, like 'skill-gap'
    return (
      <div>
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-100 flex items-center gap-4">
            {activeFeature?.icon && <activeFeature.icon className="h-8 w-8 text-sky-400" />}
            {activeFeature?.title}
          </h1>
          <p className="text-slate-400 mt-2">{activeFeature?.description}</p>
        </header>
        <div className="bg-slate-800/50 p-8 rounded-lg border border-slate-700">
          <h2 className="text-2xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-teal-400">Feature Coming Soon</h2>
          <p className="text-slate-300">
            This area will contain the fully interactive '{activeFeature?.title}' tool. 
            Our team is hard at work building this feature to help you advance your career. Stay tuned!
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex">
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden p-2 mb-4 rounded-md text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          aria-label="Open sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
