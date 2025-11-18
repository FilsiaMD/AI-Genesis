
import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { featuresData } from '../constants';
import type { SalaryPredictionResult } from '../types';
import { SalaryPredictionDisplay } from './SalaryPredictionDisplay';

const systemInstruction = `You are CareerOS Salary Prediction Engine, an AI specialized in estimating realistic salary ranges for a user’s target roles based on their skills, experience, industry, location, and market trends. Your task is to provide data-driven, actionable insights to help users understand compensation expectations and make informed career decisions.

Your responsibilities:
1.  **Salary Estimation**: Analyze the user’s profile to estimate salary ranges (min, average, max) for their target role and location.
2.  **Justification**: Provide a brief justification for the estimated range based on the user's profile and market data.
3.  **Key Factors**: Identify specific skills or experience points that positively or negatively impact the salary estimate.
4.  **Recommendations**: Suggest actionable steps, such as acquiring new skills or certifications, that could increase their earning potential.

Your primary output must be a JSON object adhering strictly to the provided schema. Base estimates on realistic market trends.`;

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        role: { type: Type.STRING, description: "The target job role being analyzed." },
        location: { type: Type.STRING, description: "The location (e.g., 'San Francisco, CA' or 'Remote, USA') for the salary estimate." },
        estimated_salary_range: {
            type: Type.OBJECT,
            properties: {
                min: { type: Type.NUMBER, description: "The lower end of the estimated salary range." },
                average: { type: Type.NUMBER, description: "The average or median estimated salary." },
                max: { type: Type.NUMBER, description: "The higher end of the estimated salary range." }
            },
            required: ["min", "average", "max"]
        },
        justification: { type: Type.STRING, description: "A brief narrative explaining the rationale behind the salary estimate." },
        skills_impacting_salary: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of key skills from the user's profile that significantly influence their earning potential for this role." },
        recommendations_to_increase_salary: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of actionable recommendations for the user to increase their salary." }
    },
    required: ["role", "location", "estimated_salary_range", "justification", "skills_impacting_salary", "recommendations_to_increase_salary"]
};

export const SalaryPrediction: React.FC = () => {
    const [targetRole, setTargetRole] = useState('Senior Software Engineer');
    const [location, setLocation] = useState('San Francisco, CA');
    const [profile, setProfile] = useState('10+ years of experience in full-stack development, specializing in React, Node.js, and AWS. Led multiple high-impact projects and mentored junior engineers. Certified AWS Solutions Architect.');
    const [isLoading, setIsLoading] = useState(false);
    const [predictionResult, setPredictionResult] = useState<SalaryPredictionResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    const feature = featuresData.find(f => f.id === 'salary');

    const handlePredict = async () => {
        if (!targetRole.trim() || !profile.trim()) {
            setError('Please provide a target role and a professional background.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setPredictionResult(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `
                Target Role: ${targetRole}
                Location: ${location || 'Not specified'}
                Professional Profile / Resume:
                ${profile}
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
            setPredictionResult(resultJson);

        } catch (e) {
            console.error(e);
            setError('An error occurred while predicting the salary. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (predictionResult) {
        return <SalaryPredictionDisplay result={predictionResult} onReset={() => setPredictionResult(null)} />;
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="target_role" className="block text-sm font-medium text-sky-400 mb-1">Target Role</label>
                        <input
                            type="text"
                            id="target_role"
                            value={targetRole}
                            onChange={e => setTargetRole(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-slate-300 mb-1">Location (Optional)</label>
                        <input
                            type="text"
                            id="location"
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                            placeholder="e.g., New York, NY or Remote"
                            className="w-full bg-slate-900 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                            disabled={isLoading}
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="profile" className="block text-sm font-medium text-slate-300 mb-1">Your Professional Profile</label>
                    <textarea
                        id="profile"
                        value={profile}
                        onChange={(e) => setProfile(e.target.value)}
                        placeholder="Paste your resume or a summary of your skills and experience here..."
                        className="w-full h-48 p-4 bg-slate-900 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none text-slate-300 resize-y"
                        disabled={isLoading}
                    />
                </div>
                <div className="mt-4 flex items-center justify-between">
                    <button
                        onClick={handlePredict}
                        disabled={isLoading}
                        className="px-6 py-2.5 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Predicting...
                            </>
                        ) : (
                            'Predict My Salary'
                        )}
                    </button>
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                </div>
            </div>
        </div>
    );
};
