
import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { featuresData } from '../constants';
import type { SkillsAnalysisResult } from '../types';
import { SkillsAnalyticsDisplay } from './SkillsAnalyticsDisplay';

const systemInstruction = `You are CareerOS Skills Analysis AI, designed to assess and analyze employee or user skill profiles to provide actionable insights. Your task is to evaluate skills, categorize them, identify gaps, and generate clear recommendations.

Your responsibilities:
1.  **Skill Categorization**: Classify skills into: Technical/Hard Skills, Soft Skills, Tools & Platforms, Certifications, and Domain Expertise.
2.  **Skill Gap Identification**: Compare current skills against common requirements for relevant roles and identify missing competencies.
3.  **Strengths Analysis**: Highlight strong skill areas and high-proficiency competencies.
4.  **Learning Recommendations**: Suggest personalized upskilling initiatives (courses, projects).
5.  **Role Alignment**: Match skills to potential career paths with a match score and justification.

Your primary output must be a JSON object adhering strictly to the provided schema. Ensure insights are actionable and prioritized.`;

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        skills_summary: {
            type: Type.OBJECT,
            properties: {
                hard_skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                soft_skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                tools: { type: Type.ARRAY, items: { type: Type.STRING } },
                certifications: { type: Type.ARRAY, items: { type: Type.STRING } },
                domain_expertise: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["hard_skills", "soft_skills", "tools", "certifications", "domain_expertise"]
        },
        strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of the user's key strengths." },
        skill_gaps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of identified skill gaps." },
        role_alignment: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    role: { type: Type.STRING },
                    match_score: { type: Type.NUMBER },
                    missing_skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                    justification: { type: Type.STRING }
                },
                required: ["role", "match_score", "missing_skills", "justification"]
            }
        },
        upskilling_recommendations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Actionable recommendations for skill development." }
    },
    required: ["skills_summary", "strengths", "skill_gaps", "role_alignment", "upskilling_recommendations"]
};


export const SkillsAnalytics: React.FC = () => {
    const [userInput, setUserInput] = useState('Experienced product manager with a background in software engineering. Skilled in Agile methodologies, Jira, roadmapping, user research, and market analysis. Proficient in Python for data analysis. Certified Scrum Product Owner (CSPO).');
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<SkillsAnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const feature = featuresData.find(f => f.id === 'analytics');

    const handleAnalyze = async () => {
        if (!userInput.trim()) {
            setError('Please describe your skills or paste your professional background.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: `Analyze the following professional skills profile: ${userInput}`,
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
        return <SkillsAnalyticsDisplay result={analysisResult} onReset={() => setAnalysisResult(null)} />;
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
                <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Paste your resume, a list of skills, or a professional summary here..."
                    className="w-full h-64 p-4 bg-slate-900 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none text-slate-300 resize-y"
                    disabled={isLoading}
                />
                <div className="mt-4 flex items-center justify-between">
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
                                Analyzing...
                            </>
                        ) : (
                            'Analyze My Skills'
                        )}
                    </button>
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                </div>
            </div>
        </div>
    );
};