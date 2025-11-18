
import React, { useState } from 'react';
import type { EnterpriseDashboardResult, DepartmentAnalytics } from '../types';

interface EnterpriseDashboardDisplayProps {
  result: EnterpriseDashboardResult;
  onReset: () => void;
}

const SkillBadge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-sky-500/20 text-sky-300">
        {children}
    </span>
);

const DepartmentContent: React.FC<{ department: DepartmentAnalytics }> = ({ department }) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
        {/* Skills Summary */}
        <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">Top Skills</h3>
            <div className="flex flex-wrap gap-2">
                {department.skills_summary.map(({ skill, count }) => (
                    <div key={skill} className="flex items-center gap-2 bg-slate-700/50 pr-3 rounded-full">
                        <span className="bg-sky-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">{count}</span>
                        <span className="text-sm text-slate-300">{skill}</span>
                    </div>
                ))}
            </div>
        </div>
        
        {/* Top Employees */}
        <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
             <h3 className="text-lg font-semibold text-slate-200 mb-4">High-Potential Talent</h3>
             <ul className="space-y-3">
                 {department.top_employees.map((emp, i) => (
                    <li key={i}>
                        <p className="font-semibold text-teal-400">{emp.name}</p>
                        <p className="text-xs text-slate-400 italic">"{emp.reason}"</p>
                    </li>
                 ))}
             </ul>
        </div>

        {/* Skill Gaps */}
        <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
             <h3 className="text-lg font-semibold text-slate-200 mb-4">Identified Skill Gaps</h3>
             <div className="flex flex-wrap gap-2">
                {department.skills_gaps.map((skill, i) => (
                    <SkillBadge key={i}>{skill}</SkillBadge>
                ))}
             </div>
        </div>

        {/* Upskilling Recommendations */}
        <div className="lg:col-span-2 xl:col-span-3 bg-slate-900/50 p-6 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">Strategic Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                     <h4 className="font-semibold text-sky-400 mb-2">Upskilling Initiatives</h4>
                     <ul className="space-y-2">
                        {department.upskilling_recommendations.map((rec, i) => (
                             <li key={i} className="flex items-start gap-3">
                                <svg className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                <span className="text-slate-300 text-sm">{rec}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                 <div>
                     <h4 className="font-semibold text-sky-400 mb-2">Internal Mobility Opportunities</h4>
                     <ul className="space-y-2">
                        {department.career_mobility_opportunities.map((opp, i) => (
                             <li key={i} className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                                <span className="text-slate-300 text-sm">{opp}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    </div>
);

export const EnterpriseDashboardDisplay: React.FC<EnterpriseDashboardDisplayProps> = ({ result, onReset }) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-teal-400">Workforce Analytics Dashboard</h2>
                    <p className="text-slate-400 mt-1">Aggregated insights for your organization's departments.</p>
                </div>
                <button
                    onClick={onReset}
                    className="px-4 py-2 bg-slate-700 text-slate-300 font-semibold rounded-md hover:bg-slate-600 transition-colors flex-shrink-0"
                >
                    New Analysis
                </button>
            </div>

            <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700">
                <div className="flex flex-wrap items-center gap-2">
                    {result.departments.map((dept, index) => (
                        <button
                            key={dept.name}
                            onClick={() => setActiveTab(index)}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                activeTab === index ? 'bg-sky-500/20 text-sky-300' : 'text-slate-400 hover:bg-slate-700/50'
                            }`}
                        >
                            {dept.name}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                {result.departments[activeTab] && <DepartmentContent department={result.departments[activeTab]} />}
            </div>
        </div>
    );
};
