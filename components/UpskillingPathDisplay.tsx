
import React from 'react';
import type { UpskillingResult } from '../types';

interface UpskillingPathDisplayProps {
  result: UpskillingResult;
  onReset: () => void;
}

const SkillBadge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-sky-500/20 text-sky-300">
        {children}
    </span>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h4 className="font-semibold text-slate-300 mb-3">{title}</h4>
        {children}
    </div>
);

export const UpskillingPathDisplay: React.FC<UpskillingPathDisplayProps> = ({ result, onReset }) => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-teal-400">Your Personalized Upskilling Path</h2>
                    <p className="text-slate-400 mt-1">Follow this roadmap to achieve your career goals.</p>
                </div>
                <button
                    onClick={onReset}
                    className="px-4 py-2 bg-slate-700 text-slate-300 font-semibold rounded-md hover:bg-slate-600 transition-colors flex-shrink-0"
                >
                    Create New Plan
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {result.learning_path.map((milestone, index) => (
                    <div key={index} className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 flex flex-col">
                        <h3 className="text-xl font-bold text-teal-400 mb-4">{milestone.milestone}</h3>
                        <div className="space-y-6 flex-grow">
                            <Section title="Skills to Learn">
                                <div className="flex flex-wrap gap-2">
                                    {milestone.skills_to_learn.map((skill, i) => <SkillBadge key={i}>{skill}</SkillBadge>)}
                                </div>
                            </Section>
                            <Section title="Recommended Courses">
                                <ul className="list-disc list-inside space-y-1 text-sm text-slate-400">
                                    {milestone.recommended_courses.map((course, i) => <li key={i}>{course}</li>)}
                                </ul>
                            </Section>
                            <Section title="Suggested Projects">
                                <ul className="list-disc list-inside space-y-1 text-sm text-slate-400">
                                    {milestone.projects.map((project, i) => <li key={i}>{project}</li>)}
                                </ul>
                            </Section>
                            <Section title="Measurable Goals">
                                <ul className="space-y-2">
                                    {milestone.measurable_goals.map((goal, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <svg className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                            <span className="text-slate-300 text-sm">{goal}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Section>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
