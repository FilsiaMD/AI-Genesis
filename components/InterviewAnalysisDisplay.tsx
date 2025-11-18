
import React from 'react';
import type { InterviewAnalysisResult, RoleAlignment } from '../types';

interface InterviewAnalysisDisplayProps {
  result: InterviewAnalysisResult;
  onReset: () => void;
}

const ScoreGauge: React.FC<{ score: number }> = ({ score }) => {
    const circumference = 2 * Math.PI * 45; // 2 * pi * r
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle className="text-slate-700" strokeWidth="10" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                {/* Progress circle */}
                <circle
                    className="text-sky-400"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                    transform="rotate(-90 50 50)"
                />
            </svg>
            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-100">{score}</span>
                <span className="text-xs text-slate-400">/ 100</span>
            </div>
        </div>
    );
};


export const InterviewAnalysisDisplay: React.FC<InterviewAnalysisDisplayProps> = ({ result, onReset }) => {
  return (
    <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
            <div>
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-teal-400">Your Interview Analysis</h2>
                <p className="text-slate-400 mt-1">Here is a breakdown of your performance and actionable feedback.</p>
            </div>
            <button
                onClick={onReset}
                className="px-4 py-2 bg-slate-700 text-slate-300 font-semibold rounded-md hover:bg-slate-600 transition-colors flex-shrink-0"
            >
                Analyze Another
            </button>
        </div>

        {/* --- Main Analysis Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Scores & Summary */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 text-center">
                    <h3 className="text-lg font-semibold text-slate-200 mb-4">Communication Score</h3>
                    <ScoreGauge score={result.communication_score} />
                </div>
                <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-200 mb-2">Transcript Summary</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{result.transcript_summary}</p>
                </div>
            </div>

            {/* Right Column: Detailed Feedback */}
            <div className="lg:col-span-2 space-y-6">
                 <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-200 mb-4">Inferred Personality Traits</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Object.entries(result.personality_traits).map(([trait, analysis]) => (
                            <div key={trait}>
                                <h4 className="font-semibold capitalize text-sky-400">{trait}</h4>
                                <p className="text-sm text-slate-400">{analysis}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-200 mb-4">Soft Skills Feedback</h3>
                    <ul className="list-disc list-inside space-y-2 text-slate-300">
                       {result.soft_skills_feedback.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </div>
            </div>
        </div>

        {/* --- Role Alignment & Recommendations --- */}
        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
             <h3 className="text-xl font-semibold text-slate-100 mb-4">Role Alignment & Next Steps</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h4 className="font-semibold text-sky-400 mb-3">Strongly Aligned Roles</h4>
                     <div className="space-y-4">
                        {result.role_alignment.map((role: RoleAlignment, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h5 className="font-semibold text-slate-200">{role.role}</h5>
                                    <span className="text-sm font-medium text-slate-400">{role.match_score}% Match</span>
                                </div>
                                 <div className="w-full bg-slate-700 rounded-full h-1.5"><div className="bg-teal-500 h-1.5 rounded-full" style={{width: `${role.match_score}%`}}></div></div>
                                <p className="text-xs text-slate-500 mt-2 italic">"{role.justification}"</p>
                            </div>
                        ))}
                    </div>
                </div>
                 <div>
                     <h4 className="font-semibold text-sky-400 mb-3">Recommended Actions</h4>
                      <ul className="space-y-2">
                        {result.recommended_actions.map((action, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <svg className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                <span className="text-slate-300 text-sm">{action}</span>
                            </li>
                        ))}
                    </ul>
                </div>
             </div>
        </div>
    </div>
  );
};
