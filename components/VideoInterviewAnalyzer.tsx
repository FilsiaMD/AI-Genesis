
import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { featuresData } from '../constants';
import type { InterviewAnalysisResult } from '../types';
import { InterviewAnalysisDisplay } from './InterviewAnalysisDisplay';

const systemInstruction = `You are CareerOS Video Interview Analyzer, an AI specialized in analyzing a user’s interview transcript to evaluate communication skills, personality traits, and professional presence. Your task is to extract actionable insights that inform career recommendations and skill gaps.

Your responsibilities:
1.  **Communication Skills Assessment**: Based on the transcript, evaluate clarity, coherence, and articulation. Provide a score from 0-100.
2.  **Personality & Behavioral Traits**: Infer personality traits (confidence, leadership, adaptability, teamwork, creativity) from the tone, word choice, and style of responses. Provide a brief summary for each.
3.  **Professional Presence & Soft Skills**: Evaluate enthusiasm, professionalism, and empathy. Provide a list of feedback points.
4.  **Role Alignment Insights**: Suggest career paths or roles where the candidate’s communication style and inferred traits are a strong fit. Provide a match score and justification.
5.  **Actionable Recommendations**: Provide a list of concrete actions the user can take to improve their interview performance.

Your primary output must be a JSON object adhering strictly to the provided schema. Be objective, professional, and constructive.`;

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        transcript_summary: { type: Type.STRING, description: "A brief summary of the key points from the user's answers." },
        communication_score: { type: Type.NUMBER, description: "A score from 0 to 100 for overall communication skills." },
        personality_traits: {
            type: Type.OBJECT,
            properties: {
                confidence: { type: Type.STRING, description: "Analysis of the user's confidence." },
                leadership: { type: Type.STRING, description: "Analysis of leadership qualities." },
                adaptability: { type: Type.STRING, description: "Analysis of adaptability." },
                teamwork: { type: Type.STRING, description: "Analysis of teamwork skills." },
                creativity: { type: Type.STRING, description: "Analysis of creativity and problem-solving." }
            },
            required: ["confidence", "leadership", "adaptability", "teamwork", "creativity"]
        },
        soft_skills_feedback: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of specific feedback points on soft skills." },
        role_alignment: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    role: { type: Type.STRING },
                    match_score: { type: Type.NUMBER },
                    justification: { type: Type.STRING }
                },
                required: ["role", "match_score", "justification"]
            }
        },
        recommended_actions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of actionable steps for improvement." }
    },
    required: ["transcript_summary", "communication_score", "personality_traits", "soft_skills_feedback", "role_alignment", "recommended_actions"]
};

export const VideoInterviewAnalyzer: React.FC = () => {
    const [questions, setQuestions] = useState('');
    const [transcript, setTranscript] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<InterviewAnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const feature = featuresData.find(f => f.id === 'interviews');

    const handleAnalyze = async () => {
        if (!transcript.trim()) {
            setError('Please paste the transcript of your interview answers.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `
                Interview Questions (for context):
                ${questions || 'Not provided.'}

                Candidate's Transcript:
                ${transcript}
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

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-slate-100 flex items-center gap-4">
                    {feature?.icon && <feature.icon className="h-8 w-8 text-sky-400" />}
                    {feature?.title}
                </h1>
                <p className="text-slate-400 mt-2 max-w-3xl">{feature?.description} Paste the interview questions and a transcript of your answers below to receive detailed feedback.</p>
            </header>
            
            {!analysisResult ? (
                <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                    <div className="space-y-4">
                         <textarea
                            value={questions}
                            onChange={(e) => setQuestions(e.target.value)}
                            placeholder="Optional: Paste the interview questions here, one per line."
                            className="w-full h-24 p-4 bg-slate-900 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none text-slate-300 resize-y"
                            disabled={isLoading}
                        />
                        <textarea
                            value={transcript}
                            onChange={(e) => setTranscript(e.target.value)}
                            placeholder="Paste the transcript of your answers here..."
                            className="w-full h-64 p-4 bg-slate-900 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none text-slate-300 resize-y"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                        <button
                            onClick={handleAnalyze}
                            disabled={isLoading}
                            className="px-6 py-2.5 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Analyzing...
                                </>
                            ) : (
                                'Analyze My Interview'
                            )}
                        </button>
                        {error && <p className="text-red-400 text-sm">{error}</p>}
                    </div>
                </div>
            ) : (
                 <InterviewAnalysisDisplay 
                    result={analysisResult} 
                    onReset={() => {
                        setAnalysisResult(null);
                        setTranscript('');
                        setQuestions('');
                    }} 
                />
            )}
        </div>
    );
};
