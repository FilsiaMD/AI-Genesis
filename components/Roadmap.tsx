
import React from 'react';
import { featuresData } from '../constants';
import { FeatureCard } from './FeatureItem';

interface DashboardProps {
  setActivePage: (pageId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActivePage }) => {
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-teal-400 mb-4">
          Welcome to Your Career Copilot
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl">
          Select a tool below to begin optimizing your career path with the power of AI.
        </p>
      </header>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {featuresData.map((feature) => (
          <FeatureCard 
            key={feature.id} 
            feature={feature} 
            onClick={() => setActivePage(feature.id)} 
          />
        ))}
      </div>
    </div>
  );
};
