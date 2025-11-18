
import React from 'react';
import type { TalentMobilityResult, InternalOpportunity, PotentialCareerPath } from '../types';

interface TalentMobilityDisplayProps {
  result: TalentMobilityResult;
  onReset: () => void;
}

const SkillBadge: React.FC<{ children: React.ReactNode, color?: string }> = ({ children, color = 'bg-amber-500/20 text-amber-300' }) => (
    <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${color}`}>
        {children}
    </span>
);

const RetentionRiskCard: React.FC<{ risk: TalentMobilityResult['retention_risk'] }> = ({ risk }) => {
    const riskColor = {
        Low: 'text-green-400 border-green-500/50',
        Medium: 'text-yellow-400 border-yellow-500/50',
        High: 'text-red-400 border-red-500/50',
    };
    return (
        <div className={`bg-slate-900/50 p-6 rounded-lg border ${riskColor[risk.level]}`}>
            <h3 className="text-lg font-semibold text-slate-200 mb-2">Retention Risk</h3>
            <p className={`text-3xl font-bold ${riskColor[risk.level]} mb-2`}>{risk.level}</p>
            <p className="text-sm text-slate-400 italic">"{risk.reason}"</p>
        </div>
    );
};

export const TalentMobilityDisplay: React.FC<TalentMobilityDisplayProps> = ({ result, onReset }) => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-teal-400">Talent Mobility Plan</h2>
                    <p className="text-slate-400 mt-1">For <span className="font-semibold text-slate-300">{result.employee_summary.name}</span> ({result.employee_summary.current_role})</p>
                </div>
                <button
                    onClick={onReset}
                    className="px-4 py-2 bg-slate-700 text-slate-300 font-semibold rounded-md hover:bg-slate-600 transition-colors flex-shrink-0"
                >
                    New Analysis
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <RetentionRiskCard risk={result.retention_risk} />
                </div>
                <div className="lg:col-span-2 bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                     <h3 className="text-lg font-semibold text-slate-200 mb-4">Top Internal Opportunities</h3>
                     <div className="space-y-4">
                        {result.internal_opportunities.map((opp, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h5 className="font-semibold text-sky-400">{opp.role_or_project}</h5>
                                    <span className="text-sm font-medium text-slate-400">{opp.match_score}% Match</span>
                                </div>
                                <div className="w-full bg-slate-700 rounded-full h-1.5"><div className="bg-gradient-to-r from-sky-500 to-teal-400 h-1.5 rounded-full" style={{width: `${opp.match_score}%`}}></div></div>
                                {opp.skills_to_develop.length > 0 && (
                                    <div className="mt-2">
                                        <p className="text-xs text-slate-400 mb-1">Development Focus:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {opp.skills_to_develop.map(skill => <SkillBadge key={skill}>{skill}</SkillBadge>)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

             <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">Potential Internal Career Paths</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {result.potential_career_paths.map((path, index) => (
                        <div key={index} className="bg-slate-900/60 p-4 rounded-md border border-slate-700">
                            <h4 className="font-bold text-teal-400 mb-2">{path.path_name}</h4>
                            <div className="mb-3">
                                <h5 className="text-sm font-semibold text-slate-400 mb-1">Next Steps:</h5>
                                <p className="text-sm text-slate-300">{path.next_steps.join(' → ')}</p>
                            </div>
                            <div>
                                <h5 className="text-sm font-semibold text-slate-400 mb-1">Development Plan:</h5>
                                <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                                    {path.development_plan.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                 <h3 className="text-lg font-semibold text-slate-200 mb-4">Organizational Recommendations</h3>
                 <ul className="space-y-3">
                    {result.mobility_recommendations.map((rec, i) => (
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
