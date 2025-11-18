
import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { featuresData } from '../constants';
import type { JobMatchResult } from '../types';
import { JobMatchesDisplay } from './JobMatchesDisplay';

const systemInstruction = `You are CareerOS Job Matching Engine, an AI specialized in analyzing a user’s skills, experience, and professional background to identify the most suitable career opportunities. Your task is to recommend high-probability roles, industries, and job categories, providing actionable insights for career growth and job applications.

Your responsibilities:
1.  **Role Recommendation**: Recommend 3–5 roles that align with the user’s current abilities and potential growth.
2.  **Match Scoring**: Assign a match score (0–100) for each role and provide a brief rationale.
3.  **Skills Analysis**: List critical required skills and highlight the user's skill gaps.
4.  **Job Market Insights**: Suggest industries, sectors, or companies hiring for each role and provide a typical salary range.
5.  **Actionable Recommendations**: Provide practical next steps for the user.

Your primary output must be a JSON object containing an array of recommended roles, adhering strictly to the provided schema.`;

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        recommended_roles: {
            type: Type.ARRAY,
            description: "A list of 3-5 recommended job roles.",
            items: {
                type: Type.OBJECT,
                properties: {
                    role: { type: Type.STRING, description: "The job title." },
                    match_score: { type: Type.NUMBER, description: "A score from 0 to 100 indicating profile match." },
                    required_skills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Skills the user possesses that match the role." },
                    missing_skills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key skills the user needs to develop for this role." },
                    justification: { type: Type.STRING, description: "A brief 1-2 sentence explanation for the recommendation and score." },
                    industry_suggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Examples of industries or sectors where this role is in demand." },
                    salary_range: { type: Type.STRING, description: "Typical salary range for this role, e.g., '$90,000 - $120,000'." }
                },
                required: ["role", "match_score", "required_skills", "missing_skills", "justification", "industry_suggestions", "salary_range"]
            }
        }
    },
    required: ["recommended_roles"]
};

export const JobMatching: React.FC = () => {
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [jobMatches, setJobMatches] = useState<JobMatchResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const jobMatchingFeature = featuresData.find(f => f.id === 'job-matching');

    const handleFindJobs = async () => {
        if (!userInput.trim()) {
            setError('Please paste your resume or professional background.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setJobMatches(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: `Analyze the following professional background and find suitable job matches: ${userInput}`,
                config: {
                    systemInstruction,
                    responseMimeType: 'application/json',
                    responseSchema: responseSchema,
                },
            });
            
            const resultText = response.text;
            const resultJson = JSON.parse(resultText);
            setJobMatches(resultJson);

        } catch (e) {
            console.error(e);
            setError('An error occurred while finding job matches. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-slate-100 flex items-center gap-4">
                    {jobMatchingFeature?.icon && <jobMatchingFeature.icon className="h-8 w-8 text-sky-400" />}
                    {jobMatchingFeature?.title}
                </h1>
                <p className="text-slate-400 mt-2 max-w-3xl">{jobMatchingFeature?.description} Paste your profile below to discover jobs that are the right fit for you.</p>
            </header>
            
            {!jobMatches ? (
                <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                    <textarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Paste your resume, LinkedIn profile summary, or a description of your experience here..."
                        className="w-full h-64 p-4 bg-slate-900 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none text-slate-300 resize-y"
                        disabled={isLoading}
                    />
                    <div className="mt-4 flex items-center justify-between">
                        <button
                            onClick={handleFindJobs}
                            disabled={isLoading}
                            className="px-6 py-2.5 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Matching...
                                </>
                            ) : (
                                'Find Job Matches'
                            )}
                        </button>
                        {error && <p className="text-red-400 text-sm">{error}</p>}
                    </div>
                </div>
            ) : (
                 <JobMatchesDisplay 
                    results={jobMatches} 
                    onReset={() => {
                        setJobMatches(null);
                        setUserInput('');
                    }} 
                />
            )}
        </div>
    );
};
