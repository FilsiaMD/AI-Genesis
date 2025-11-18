
import React, { useState } from 'react';
import type { AnalysisResult, RecommendedRole } from '../types';

interface ResultsDisplayProps {
  result: AnalysisResult;
  onReset: () => void;
}

const Accordion: React.FC<{ title: string, children: React.ReactNode, defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden mb-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left font-semibold text-slate-200 hover:bg-slate-700/50"
            >
                <span>{title}</span>
                <svg className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <div className="p-4 border-t border-slate-700 text-slate-300">
                    {children}
                </div>
            )}
        </div>
    );
};

const SkillBadge: React.FC<{ children: React.ReactNode, color?: string }> = ({ children, color = 'bg-sky-500/20 text-sky-300' }) => (
    <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${color}`}>
        {children}
    </span>
);

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, onReset }) => {
  return (
    <div className="space-y-8 animate-fade-in">
        <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-teal-400">Your Personalized Career Analysis</h2>
                    <p className="text-slate-400 mt-1">Here is your AI-generated career roadmap and professional summary.</p>
                </div>
                <button
                    onClick={onReset}
                    className="px-4 py-2 bg-slate-700 text-slate-300 font-semibold rounded-md hover:bg-slate-600 transition-colors flex-shrink-0"
                >
                    Start Over
                </button>
            </div>
        </div>

        <Accordion title="Your Career Persona" defaultOpen>
            <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed">{result.career_persona}</p>
        </Accordion>

        <Accordion title="Top Recommended Roles">
            <div className="space-y-6">
                {result.recommended_roles.map((role: RecommendedRole, index) => (
                    <div key={index} className="bg-slate-900/70 p-4 rounded-lg border border-slate-700">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-xl font-bold text-sky-400">{role.role}</h4>
                            <div className="text-right">
                                <p className="font-semibold text-lg text-slate-200">{role.match_score}%</p>
                                <p className="text-xs text-slate-400">Match Score</p>
                            </div>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2.5 mb-4">
                            <div className="bg-gradient-to-r from-sky-500 to-teal-400 h-2.5 rounded-full" style={{ width: `${role.match_score}%` }}></div>
                        </div>
                         <p className="text-sm text-slate-400 mb-4 italic">"{role.justification}"</p>
                        
                        {role.missing_skills.length > 0 && (
                            <div className="mb-2">
                                <h5 className="text-sm font-semibold mb-2 text-slate-300">Skills to Develop:</h5>
                                <div className="flex flex-wrap gap-2">
                                    {role.missing_skills.map(skill => <SkillBadge key={skill} color="bg-amber-500/20 text-amber-300">{skill}</SkillBadge>)}
                                </div>
                            </div>
                        )}
                         {role.required_skills.length > 0 && (
                            <div>
                                <h5 className="text-sm font-semibold mb-2 text-slate-300">Your Matching Skills:</h5>
                                <div className="flex flex-wrap gap-2">
                                    {role.required_skills.map(skill => <SkillBadge key={skill}>{skill}</SkillBadge>)}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </Accordion>

        <Accordion title="Your 30-60-90 Day Career Roadmap">
            <div className="grid md:grid-cols-3 gap-6">
                <div>
                    <h4 className="font-semibold text-lg text-slate-200 mb-2 border-b border-slate-600 pb-2">First 30 Days</h4>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                        {result.career_roadmap['30_days'].map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </div>
                 <div>
                    <h4 className="font-semibold text-lg text-slate-200 mb-2 border-b border-slate-600 pb-2">60 Days</h4>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                        {result.career_roadmap['60_days'].map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </div>
                 <div>
                    <h4 className="font-semibold text-lg text-slate-200 mb-2 border-b border-slate-600 pb-2">90 Days</h4>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                        {result.career_roadmap['90_days'].map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </div>
            </div>
        </Accordion>

        <Accordion title="Optimized Resume Summary">
             <p className="whitespace-pre-wrap font-mono text-sm bg-slate-900 p-4 rounded-md border border-slate-700">{result.resume}</p>
        </Accordion>

    </div>
  );
};
