
import React from 'react';
import type { JobMatchResult, RecommendedJobRole } from '../types';

const SkillBadge: React.FC<{ children: React.ReactNode, color?: string }> = ({ children, color = 'bg-sky-500/20 text-sky-300' }) => (
    <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${color}`}>
        {children}
    </span>
);

interface JobMatchesDisplayProps {
  results: JobMatchResult;
  onReset: () => void;
}

export const JobMatchesDisplay: React.FC<JobMatchesDisplayProps> = ({ results, onReset }) => {
  return (
    <div className="space-y-8 animate-fade-in">
        <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-teal-400">Your Top Job Matches</h2>
                    <p className="text-slate-400 mt-1">Here are the top roles that align with your professional profile.</p>
                </div>
                <button
                    onClick={onReset}
                    className="px-4 py-2 bg-slate-700 text-slate-300 font-semibold rounded-md hover:bg-slate-600 transition-colors flex-shrink-0"
                >
                    Start Over
                </button>
            </div>
        </div>

        <div className="space-y-6">
            {results.recommended_roles.map((role: RecommendedJobRole, index) => (
                <div key={index} className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 transform transition-transform hover:scale-[1.02] hover:border-sky-500/50">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-4">
                        <div>
                            <h3 className="text-2xl font-bold text-sky-400">{role.role}</h3>
                            <p className="text-sm text-slate-400 mt-1 italic">"{role.justification}"</p>
                        </div>
                        <div className="text-left sm:text-right flex-shrink-0">
                            <p className="font-semibold text-2xl text-slate-100">{role.match_score}%</p>
                            <p className="text-xs text-slate-400 uppercase tracking-wider">Match Score</p>
                        </div>
                    </div>

                    <div className="w-full bg-slate-700 rounded-full h-2 mb-6">
                        <div className="bg-gradient-to-r from-sky-500 to-teal-400 h-2 rounded-full" style={{ width: `${role.match_score}%` }}></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            {role.missing_skills.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="text-sm font-semibold mb-2 text-slate-300 uppercase tracking-wider">Skills to Develop</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {role.missing_skills.map(skill => <SkillBadge key={skill} color="bg-amber-500/20 text-amber-300">{skill}</SkillBadge>)}
                                    </div>
                                </div>
                            )}
                            {role.required_skills.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold mb-2 text-slate-300 uppercase tracking-wider">Your Matching Skills</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {role.required_skills.map(skill => <SkillBadge key={skill}>{skill}</SkillBadge>)}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="bg-slate-900/60 p-4 rounded-md border border-slate-700">
                             <div className="mb-3">
                                <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Potential Industries</h4>
                                <p className="text-slate-400 text-sm mt-1">{role.industry_suggestions.join(', ')}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Estimated Salary</h4>
                                <p className="text-teal-400 font-semibold text-lg mt-1">{role.salary_range}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};
