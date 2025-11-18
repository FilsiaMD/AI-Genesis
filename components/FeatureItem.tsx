
import React from 'react';
import type { Feature } from '../types';

interface FeatureCardProps {
  feature: Feature;
  onClick: () => void;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ feature, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group relative bg-slate-800/50 p-6 rounded-xl border border-slate-700 cursor-pointer 
                 transition-all duration-300 ease-in-out
                 hover:border-sky-500/50 hover:bg-slate-800 hover:-translate-y-1"
    >
      <div className="mb-4">
        <feature.icon className="h-8 w-8 text-slate-400 transition-colors duration-300 group-hover:text-sky-400" />
      </div>
      <h3 className="font-bold text-lg text-slate-100 mb-2">{feature.title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
      
      <div className="absolute top-0 right-0 p-3 text-slate-600 group-hover:text-sky-400 transition-transform duration-300 transform group-hover:-translate-x-1 group-hover:-translate-y-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </div>
    </div>
  );
};
