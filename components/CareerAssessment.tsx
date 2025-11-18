
import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { featuresData } from '../constants';
import type { AnalysisResult } from '../types';
import { ResultsDisplay } from './ResultsDisplay';

const systemInstruction = `You are CareerOS, an advanced AI Career Generator and Professional Development Assistant. Your task is to analyze a user’s professional background, including resumes, text input, and optional video transcripts, to produce a structured, actionable, and personalized career roadmap. Your outputs should be precise, clear, and actionable, using JSON formatting for structured data.

Your responsibilities include:

1. **Career Identity Detection**: Analyze the user's professional background to identify their strengths, weaknesses, work style, and ideal roles. Generate a clear career persona, describing key attributes and motivations.
2. **Experience & Skills Extraction**: Extract hard skills, soft skills, tools, certifications, job roles, achievements, and education from resumes or text input.
3. **Career Path Generation**: Recommend 3–5 high-probability career paths. For each, provide: Role name, Match score (0–100), Required skills, Missing skills, and a justification.
4. **Skill Gap Analysis**: Compare current skills with requirements of each recommended path, identify missing competencies, and suggest learning strategies.
5. **Resume & Profile Builder**: Generate an optimized resume or LinkedIn summary tailored to target roles.
6. **Personalized Career Roadmap**: Produce a 30/60/90-day action plan.
7. **Job Market Insights**: Suggest industries, trending jobs, and salary ranges.

Your primary output must be a JSON object matching the provided schema. Ensure outputs are ready for direct use in applications. Keep responses professional and tailored to individual career growth.
`;

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        career_persona: { type: Type.STRING, description: "A summary of the user's professional persona." },
        skills: {
            type: Type.OBJECT,
            properties: {
                hard_skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                soft_skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                tools: { type: Type.ARRAY, items: { type: Type.STRING } },
                certifications: { type: Type.ARRAY, items: { type: Type.STRING } },
                experience: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            role: { type: Type.STRING },
                            company: { type: Type.STRING },
                            duration: { type: Type.STRING },
                            achievements: { type: Type.ARRAY, items: { type: Type.STRING } }
                        },
                         required: ["role", "company", "duration", "achievements"]
                    }
                }
            },
            required: ["hard_skills", "soft_skills", "tools", "certifications", "experience"]
        },
        recommended_roles: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    role: { type: Type.STRING },
                    match_score: { type: Type.NUMBER, description: "A score from 0 to 100." },
                    required_skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                    missing_skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                    justification: { type: Type.STRING }
                },
                required: ["role", "match_score", "required_skills", "missing_skills", "justification"]
            }
        },
        skill_gaps: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    skill: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ['technical', 'behavioral', 'domain-specific'] },
                    suggestion: { type: Type.STRING, description: "Actionable advice to close the skill gap." }
                },
                required: ["skill", "type", "suggestion"]
            }
        },
        career_roadmap: {
            type: Type.OBJECT,
            properties: {
                "30_days": { type: Type.ARRAY, items: { type: Type.STRING } },
                "60_days": { type: Type.ARRAY, items: { type: Type.STRING } },
                "90_days": { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["30_days", "60_days", "90_days"]
        },
        resume: { type: Type.STRING, description: "An optimized resume summary." }
    },
     required: ["career_persona", "skills", "recommended_roles", "skill_gaps", "career_roadmap", "resume"]
};


export const CareerAssessment: React.FC = () => {
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const assessmentFeature = featuresData.find(f => f.id === 'assessment');

    const handleAnalyze = async () => {
        if (!userInput.trim()) {
            setError('Please paste your resume or professional background.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: userInput,
                config: {
                    systemInstruction,
                    responseMimeType: 'application/json',
                    responseSchema: responseSchema,
                },
            });
            
            const resultText = response.text;
            const resultJson = JSON.parse(resultText);
            setAnalysisResult(resultJson);

        } catch (e) {
            console.error(e);
            setError('An error occurred while analyzing your information. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-slate-100 flex items-center gap-4">
                    {assessmentFeature?.icon && <assessmentFeature.icon className="h-8 w-8 text-sky-400" />}
                    {assessmentFeature?.title}
                </h1>
                <p className="text-slate-400 mt-2 max-w-3xl">{assessmentFeature?.description} Paste your resume or a summary of your experience below to get started.</p>
            </header>
            
            {!analysisResult && (
                <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                    <textarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Paste your resume or describe your professional background here..."
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
                                'Generate My Career Plan'
                            )}
                        </button>
                        {error && <p className="text-red-400 text-sm">{error}</p>}
                    </div>
                </div>
            )}

            {analysisResult && (
                 <ResultsDisplay 
                    result={analysisResult} 
                    onReset={() => {
                        setAnalysisResult(null);
                        setUserInput('');
                    }} 
                />
            )}
        </div>
    );
};
