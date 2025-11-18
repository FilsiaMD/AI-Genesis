
import React from 'react';
import type { SalaryPredictionResult } from '../types';

interface SalaryPredictionDisplayProps {
  result: SalaryPredictionResult;
  onReset: () => void;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);
};

const SkillBadge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-teal-500/20 text-teal-300">
        {children}
    </span>
);

export const SalaryPredictionDisplay: React.FC<SalaryPredictionDisplayProps> = ({ result, onReset }) => {
    const { min, average, max } = result.estimated_salary_range;
    const totalRange = max - min;
    const averagePosition = totalRange > 0 ? ((average - min) / totalRange) * 100 : 50;

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-teal-400">Your Salary Estimate</h2>
                    <p className="text-slate-400 mt-1">For a <span className="font-semibold text-slate-300">{result.role}</span> in <span className="font-semibold text-slate-300">{result.location}</span>.</p>
                </div>
                <button
                    onClick={onReset}
                    className="px-4 py-2 bg-slate-700 text-slate-300 font-semibold rounded-md hover:bg-slate-600 transition-colors flex-shrink-0"
                >
                    New Prediction
                </button>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                <div className="mb-4">
                     <div className="relative h-8 bg-slate-700 rounded-full w-full">
                        <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-sky-500 to-teal-400 rounded-full" style={{ width: '100%' }}></div>
                        {/* Average marker */}
                        <div className="absolute top-1/2 h-10 w-1 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2" style={{ left: `${averagePosition}%` }}>
                             <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-xs rounded-md shadow-lg whitespace-nowrap">
                                {formatCurrency(average)}
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-900"></div>
                            </div>
                        </div>
                    </div>
                     <div className="flex justify-between mt-2 text-sm text-slate-400">
                        <span>{formatCurrency(min)}</span>
                        <span>{formatCurrency(max)}</span>
                    </div>
                </div>
                <p className="text-center text-slate-400 text-sm mt-6 italic">"{result.justification}"</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-200 mb-4">Key Salary Factors</h3>
                    <div className="flex flex-wrap gap-2">
                        {result.skills_impacting_salary.map((skill, i) => <SkillBadge key={i}>{skill}</SkillBadge>)}
                    </div>
                </div>
                <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-200 mb-4">How to Increase Your Salary</h3>
                    <ul className="space-y-3">
                        {result.recommendations_to_increase_salary.map((rec, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <svg className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                <span className="text-slate-300 text-sm">{rec}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

        </div>
    );
};
