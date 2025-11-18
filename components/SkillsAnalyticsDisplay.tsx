
import React from 'react';
import type { SkillsAnalysisResult, SkillBasedRoleAlignment } from '../types';

interface SkillsAnalyticsDisplayProps {
  result: SkillsAnalysisResult;
  onReset: () => void;
}

const SkillBadge: React.FC<{ children: React.ReactNode, color?: string }> = ({ children, color = 'bg-sky-500/20 text-sky-300' }) => (
    <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap {color}`}>
        {children}
    </span>
);

export const SkillsAnalyticsDisplay: React.FC<SkillsAnalyticsDisplayProps> = ({ result, onReset }) => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-teal-400">Your Skills Analysis</h2>
                    <p className="text-slate-400 mt-1">Here is a detailed breakdown of your professional skills.</p>
                </div>
                <button
                    onClick={onReset}
                    className="px-4 py-2 bg-slate-700 text-slate-300 font-semibold rounded-md hover:bg-slate-600 transition-colors flex-shrink-0"
                >
                    Analyze Again
                </button>
            </div>

            {/* --- Skills Summary --- */}
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                <h3 className="text-xl font-semibold text-slate-100 mb-4">Skills Summary</h3>
                <div className="space-y-4">
                    {Object.entries(result.skills_summary).map(([category, skills]) => (
                        (skills as string[]).length > 0 && (
                            <div key={category}>
                                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                    {category.replace('_', ' ')}
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {(skills as string[]).map((skill, i) => <SkillBadge key={i}>{skill}</SkillBadge>)}
                                </div>
                            </div>
                        )
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Strengths & Gaps */}
                <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-200 mb-4">Strengths vs. Gaps</h3>
                     <div className="mb-4">
                         <h4 className="font-semibold text-teal-400 mb-2">Key Strengths</h4>
                         <ul className="list-disc list-inside space-y-1 text-slate-300 text-sm">
                             {result.strengths.map((item, i) => <li key={i}>{item}</li>)}
                         </ul>
                     </div>
                     <div>
                         <h4 className="font-semibold text-amber-400 mb-2">Areas for Development</h4>
                         <ul className="list-disc list-inside space-y-1 text-slate-300 text-sm">
                             {result.skill_gaps.map((item, i) => <li key={i}>{item}</li>)}
                         </ul>
                     </div>
                </div>
                
                {/* Role Alignment */}
                <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-200 mb-4">Potential Role Alignment</h3>
                    <div className="space-y-4">
                        {result.role_alignment.map((role: SkillBasedRoleAlignment, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h5 className="font-semibold text-slate-200">{role.role}</h5>
                                    <span className="text-sm font-medium text-slate-400">{role.match_score}% Match</span>
                                </div>
                                <div className="w-full bg-slate-700 rounded-full h-1.5"><div className="bg-gradient-to-r from-sky-500 to-teal-400 h-1.5 rounded-full" style={{width: `${role.match_score}%`}}></div></div>
                                {role.missing_skills.length > 0 && (
                                    <div className="mt-2">
                                        <p className="text-xs text-slate-400">Focus on: {role.missing_skills.join(', ')}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Recommendations */}
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                 <h3 className="text-lg font-semibold text-slate-200 mb-4">Upskilling Recommendations</h3>
                 <ul className="space-y-3">
                    {result.upskilling_recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <svg className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                            <span className="text-slate-300 text-sm">{rec}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
