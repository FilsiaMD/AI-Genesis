
import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { featuresData } from '../constants';
import type { EnterpriseDashboardResult } from '../types';
import { EnterpriseDashboardDisplay } from './EnterpriseDashboardDisplay';

const systemInstruction = `You are CareerOS Enterprise Dashboard AI, a system designed to provide organizations with a comprehensive view of their workforce’s skills, career trajectories, and talent mobility opportunities. Your task is to process structured employee data and generate actionable insights and analytics for HR, L&D, and management teams.

Your responsibilities:
1.  **Workforce Skill Analysis**: Aggregate and analyze employee skills across departments. Identify skill distributions, strengths, and weaknesses.
2.  **Talent Identification**: Highlight high-potential employees based on their skill sets and experience.
3.  **Gap Analysis**: Identify critical skill gaps within each department.
4.  **Actionable Recommendations**: Suggest upskilling initiatives and internal mobility opportunities.

Your primary output must be a JSON object containing an array of departments with their respective analytics, adhering strictly to the provided schema. Ensure insights are actionable and relevant to business strategy.`;

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        departments: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    skills_summary: {
                        type: Type.ARRAY,
                        description: "A summary of the top skills in the department.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                skill: { type: Type.STRING },
                                count: { type: Type.NUMBER, description: "Number of employees with this skill." }
                            },
                             required: ["skill", "count"]
                        }
                    },
                    top_employees: {
                        type: Type.ARRAY,
                        description: "Employees identified as high-potential or key contributors.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                reason: { type: Type.STRING, description: "Why this employee was highlighted." }
                            },
                            required: ["name", "reason"]
                        }
                    },
                    skills_gaps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Critical skills missing or underrepresented in the department." },
                    upskilling_recommendations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Actionable recommendations for training and development." },
                    career_mobility_opportunities: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Potential internal career moves for employees in this department." }
                },
                required: ["name", "skills_summary", "top_employees", "skills_gaps", "upskilling_recommendations", "career_mobility_opportunities"]
            }
        }
    },
    required: ["departments"]
};

const exampleData = JSON.stringify([
    { "id": "E101", "name": "Alice Johnson", "role": "Senior Software Engineer", "department": "Engineering", "skills": ["React", "Node.js", "AWS", "TypeScript"], "experience_years": 8 },
    { "id": "E102", "name": "Bob Williams", "role": "Software Engineer", "department": "Engineering", "skills": ["Python", "Django", "PostgreSQL"], "experience_years": 3 },
    { "id": "E103", "name": "Charlie Brown", "role": "Product Manager", "department": "Product", "skills": ["Agile", "Jira", "Roadmapping", "User Research"], "experience_years": 6 },
    { "id": "M201", "name": "Diana Miller", "role": "Marketing Specialist", "department": "Marketing", "skills": ["SEO", "Content Marketing", "Google Analytics"], "experience_years": 4 }
], null, 2);

const Accordion: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg overflow-hidden my-4">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-3 text-left text-sm font-medium text-slate-400 hover:bg-slate-700/50">
                <span>{title}</span>
                <svg className={`w-4 h-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isOpen && <div className="p-3 border-t border-slate-700">{children}</div>}
        </div>
    );
};


export const EnterpriseDashboard: React.FC = () => {
    const [userInput, setUserInput] = useState(exampleData);
    const [isLoading, setIsLoading] = useState(false);
    const [dashboardResult, setDashboardResult] = useState<EnterpriseDashboardResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const feature = featuresData.find(f => f.id === 'enterprise');

    const handleGenerate = async () => {
        setError(null);
        try {
            JSON.parse(userInput); // Validate JSON before sending
        } catch (jsonError) {
            setError('Invalid JSON format. Please check your data.');
            return;
        }

        setIsLoading(true);
        setDashboardResult(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: `Analyze the following employee dataset: ${userInput}`,
                config: {
                    systemInstruction,
                    responseMimeType: 'application/json',
                    responseSchema,
                },
            });
            
            const resultJson = JSON.parse(response.text);
            setDashboardResult(resultJson);

        } catch (e) {
            console.error(e);
            setError('An error occurred while generating the dashboard. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (dashboardResult) {
        return <EnterpriseDashboardDisplay result={dashboardResult} onReset={() => setDashboardResult(null)} />;
    }

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-slate-100 flex items-center gap-4">
                    {feature?.icon && <feature.icon className="h-8 w-8 text-sky-400" />}
                    {feature?.title}
                </h1>
                <p className="text-slate-400 mt-2 max-w-3xl">{feature?.description}</p>
            </header>
            
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                <label htmlFor="employee_data" className="block text-sm font-medium text-slate-300 mb-2">
                    Paste your employee data JSON below
                </label>
                <textarea
                    id="employee_data"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Paste your employee data here in JSON format..."
                    className="w-full h-80 p-4 bg-slate-900 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none text-slate-300 resize-y font-mono text-xs"
                    disabled={isLoading}
                />
                 <Accordion title="Click to see required JSON format">
                    <pre className="text-xs text-slate-400 bg-slate-800 p-2 rounded-md">{exampleData}</pre>
                </Accordion>
                <div className="mt-4 flex items-center justify-between">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="px-6 py-2.5 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating Insights...
                            </>
                        ) : 'Generate Dashboard' }
                    </button>
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                </div>
            </div>
        </div>
    );
};
