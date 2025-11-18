
import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { featuresData } from '../constants';
import type { TalentMobilityResult } from '../types';
import { TalentMobilityDisplay } from './TalentMobilityDisplay';

const systemInstruction = `You are the CareerOS Talent Mobility Engine, an AI designed to help organizations facilitate internal career growth and retain talent. Your task is to analyze an employee's profile in the context of available internal roles and generate a strategic mobility plan.

Your responsibilities:
1.  **Internal Opportunity Matching**: Match the employee to the most suitable internal roles or projects from the provided list. Provide a match score (0-100), justification, and skills to develop for each match.
2.  **Career Path Simulation**: Generate 1-2 potential career paths for the employee *within the organization*, outlining next steps and a development plan.
3.  **Retention Risk Assessment**: Assess the employee's retention risk (Low, Medium, High) and provide a reason.
4.  **Mobility Recommendations**: Provide actionable recommendations for the *organization* to support this employee's growth and mobility.

Your primary output must be a JSON object adhering strictly to the provided schema. The analysis must be strategic, data-driven, and focused on internal talent development.`;

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        employee_summary: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                current_role: { type: Type.STRING }
            },
            required: ["name", "current_role"]
        },
        internal_opportunities: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    role_or_project: { type: Type.STRING },
                    match_score: { type: Type.NUMBER },
                    justification: { type: Type.STRING },
                    skills_to_develop: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["role_or_project", "match_score", "justification", "skills_to_develop"]
            }
        },
        potential_career_paths: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    path_name: { type: Type.STRING },
                    next_steps: { type: Type.ARRAY, items: { type: Type.STRING } },
                    development_plan: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["path_name", "next_steps", "development_plan"]
            }
        },
        retention_risk: {
            type: Type.OBJECT,
            properties: {
                level: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
                reason: { type: Type.STRING }
            },
            required: ["level", "reason"]
        },
        mobility_recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Recommendations for the organization."
        }
    },
    required: ["employee_summary", "internal_opportunities", "potential_career_paths", "retention_risk", "mobility_recommendations"]
};


export const TalentMobilityEngine: React.FC = () => {
    const [employeeProfile, setEmployeeProfile] = useState('Name: Alex Chen\nCurrent Role: Senior Marketing Analyst\nExperience: 5 years in data-driven marketing, SEO/SEM, and campaign management. Strong analytical skills (SQL, Tableau) and a proven record of increasing lead generation by over 50%. Expressed interest in moving into a product marketing role.');
    const [internalRoles, setInternalRoles] = useState('1. Product Marketing Manager: Requires deep product knowledge, GTM strategy experience, and strong cross-functional collaboration skills.\n2. Data Scientist, Marketing: Requires advanced statistical modeling, Python/R, and experience with predictive analytics.\n3. Senior SEO Strategist: Requires expert-level SEO knowledge, technical SEO auditing skills, and content strategy leadership.');
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<TalentMobilityResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const feature = featuresData.find(f => f.id === 'mobility');

    const handleAnalyze = async () => {
        if (!employeeProfile.trim() || !internalRoles.trim()) {
            setError('Please provide both the employee profile and the list of internal roles.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `
                Employee Profile:
                ${employeeProfile}

                Available Internal Roles/Projects:
                ${internalRoles}
            `;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: prompt,
                config: {
                    systemInstruction,
                    responseMimeType: 'application/json',
                    responseSchema: responseSchema,
                },
            });

            const resultJson = JSON.parse(response.text);
            setAnalysisResult(resultJson);

        } catch (e) {
            console.error(e);
            setError('An error occurred during analysis. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (analysisResult) {
        return <TalentMobilityDisplay result={analysisResult} onReset={() => setAnalysisResult(null)} />;
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
            
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 space-y-4">
                <div>
                    <label htmlFor="employee_profile" className="block text-sm font-medium text-sky-400 mb-1">
                        Employee Profile
                    </label>
                    <textarea
                        id="employee_profile"
                        value={employeeProfile}
                        onChange={(e) => setEmployeeProfile(e.target.value)}
                        placeholder="Paste the employee's resume, skills, and career goals here..."
                        className="w-full h-40 p-4 bg-slate-900 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none text-slate-300 resize-y"
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <label htmlFor="internal_roles" className="block text-sm font-medium text-slate-300 mb-1">
                        Available Internal Roles / Projects
                    </label>
                    <textarea
                        id="internal_roles"
                        value={internalRoles}
                        onChange={(e) => setInternalRoles(e.target.value)}
                        placeholder="List available internal job openings, projects, or mentorship opportunities here, one per line."
                        className="w-full h-32 p-4 bg-slate-900 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none text-slate-300 resize-y"
                        disabled={isLoading}
                    />
                </div>
                <div className="pt-2 flex items-center justify-between">
                    <button
                        onClick={handleAnalyze}
                        disabled={isLoading}
                        className="px-6 py-2.5 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Analyzing Mobility...
                            </>
                        ) : (
                            'Generate Mobility Plan'
                        )}
                    </button>
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                </div>
            </div>
        </div>
    );
};