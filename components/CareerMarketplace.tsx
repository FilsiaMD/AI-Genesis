
import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { featuresData } from '../constants';
import type { CareerMarketplaceResult } from '../types';
import { CareerMarketplaceDisplay } from './CareerMarketplaceDisplay';

const systemInstruction = `You are CareerOS Career Marketplace AI, an intelligent system designed to connect users with career opportunities. Your task is to provide actionable, personalized, and market-aligned recommendations to help users discover and secure the most relevant opportunities.

Your responsibilities:
1.  **Opportunity Matching**: Analyze user skills, experience, and goals to recommend top-fit roles, freelance projects, or contract opportunities. Rank them by match score (0–100).
2.  **Employer & Role Insights**: Provide details about the organization, role expectations, and required skills.
3.  **Skill Gap & Readiness Assessment**: Compare the user's skills with role requirements and identify gaps.
4.  **Compensation & Growth Guidance**: Include typical salary ranges and highlight career growth potential.

Your primary output must be a JSON object containing an array of recommended opportunities, adhering strictly to the provided schema. Prioritize high-probability matches.`;

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        recommended_opportunities: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    role: { type: Type.STRING },
                    organization: { type: Type.STRING },
                    match_score: { type: Type.NUMBER },
                    required_skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                    missing_skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                    justification: { type: Type.STRING },
                    location: { type: Type.STRING },
                    salary_range: { type: Type.STRING },
                    career_growth_potential: { type: Type.STRING }
                },
                required: ["role", "organization", "match_score", "required_skills", "missing_skills", "justification", "location", "salary_range", "career_growth_potential"]
            }
        }
    },
    required: ["recommended_opportunities"]
};


export const CareerMarketplace: React.FC = () => {
    const [userProfile, setUserProfile] = useState('Senior software engineer with 8 years of experience in full-stack development, specializing in React, TypeScript, Node.js, and cloud services (AWS, GCP). Passionate about building scalable applications and leading agile teams.');
    const [preferences, setPreferences] = useState('Looking for a remote senior or lead engineering role in a fast-growing tech startup. Interested in FinTech or HealthTech industries. Open to contract or full-time positions.');
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<CareerMarketplaceResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const feature = featuresData.find(f => f.id === 'marketplace');

    const handleAnalyze = async () => {
        if (!userProfile.trim()) {
            setError('Please provide your professional profile.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `
                User Profile:
                ${userProfile}

                Career Preferences:
                ${preferences}
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
            setError('An error occurred while finding opportunities. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (analysisResult) {
        return <CareerMarketplaceDisplay result={analysisResult} onReset={() => setAnalysisResult(null)} />;
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
                    <label htmlFor="user_profile" className="block text-sm font-medium text-sky-400 mb-1">
                        Your Professional Profile
                    </label>
                    <textarea
                        id="user_profile"
                        value={userProfile}
                        onChange={(e) => setUserProfile(e.target.value)}
                        placeholder="Paste your resume, skills, and experience here..."
                        className="w-full h-40 p-4 bg-slate-900 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none text-slate-300 resize-y"
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <label htmlFor="preferences" className="block text-sm font-medium text-slate-300 mb-1">
                        Your Career Goals & Preferences
                    </label>
                    <textarea
                        id="preferences"
                        value={preferences}
                        onChange={(e) => setPreferences(e.target.value)}
                        placeholder="Describe your ideal role, industry, location, etc."
                        className="w-full h-24 p-4 bg-slate-900 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none text-slate-300 resize-y"
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
                                Finding Opportunities...
                            </>
                        ) : (
                            'Find My Next Opportunity'
                        )}
                    </button>
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                </div>
            </div>
        </div>
    );
};
