
import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { featuresData } from '../constants';
import type { UpskillingResult } from '../types';
import { UpskillingPathDisplay } from './UpskillingPathDisplay';

const systemInstruction = `You are CareerOS Personalized Upskilling Advisor, an AI specialized in designing customized learning and development plans. Your task is to provide structured, actionable, and prioritized upskilling paths to help users achieve their target roles.

Your responsibilities:
1.  **Analyze Skill Gaps**: Based on the user's current skills and target role, identify the most important missing competencies.
2.  **Design Learning Path**: Generate a clear, actionable roadmap with milestones (Short-term, Medium-term, Long-term).
3.  **Provide Resources**: For each milestone, recommend specific online courses, certifications, hands-on projects, and measurable goals.
4.  **Prioritize for Impact**: Tailor recommendations to highlight skills that offer the highest ROI for career growth.

Your primary output must be a JSON object with a structured learning plan, adhering strictly to the provided schema. Ensure recommendations are realistic and actionable.`;

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        learning_path: {
            type: Type.ARRAY,
            description: "A structured learning path with 3 milestones.",
            items: {
                type: Type.OBJECT,
                properties: {
                    milestone: { type: Type.STRING, description: "The timeframe for the milestone, e.g., 'Short-term / 1–4 weeks'." },
                    skills_to_learn: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific skills to focus on during this phase." },
                    recommended_courses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of suggested online courses or tutorials." },
                    projects: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Ideas for hands-on projects to apply new skills." },
                    measurable_goals: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Clear, measurable goals to track progress." }
                },
                required: ["milestone", "skills_to_learn", "recommended_courses", "projects", "measurable_goals"]
            }
        }
    },
    required: ["learning_path"]
};

export const PersonalizedUpskilling: React.FC = () => {
    const [targetRole, setTargetRole] = useState('Senior Data Scientist');
    const [currentSkills, setCurrentSkills] = useState('Python, SQL, Pandas, Scikit-learn, Matplotlib, basic machine learning concepts.');
    const [skillGaps, setSkillGaps] = useState('Deep Learning (TensorFlow/PyTorch), advanced statistical modeling, cloud platforms (AWS/GCP), big data technologies (Spark).');
    const [isLoading, setIsLoading] = useState(false);
    const [upskillingResult, setUpskillingResult] = useState<UpskillingResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const feature = featuresData.find(f => f.id === 'upskilling');

    const handleGenerate = async () => {
        if (!targetRole.trim() || !currentSkills.trim() || !skillGaps.trim()) {
            setError('Please fill in all fields to generate a learning plan.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setUpskillingResult(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `
                Target Role: ${targetRole}
                Current Skills: ${currentSkills}
                Skills to Learn / Gaps: ${skillGaps}
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
            setUpskillingResult(resultJson);

        } catch (e) {
            console.error(e);
            setError('An error occurred while generating the plan. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (upskillingResult) {
        return <UpskillingPathDisplay result={upskillingResult} onReset={() => setUpskillingResult(null)} />;
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
                    <label htmlFor="target_role" className="block text-sm font-medium text-sky-400 mb-1">Your Target Role</label>
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
                    <label htmlFor="current_skills" className="block text-sm font-medium text-slate-300 mb-1">Your Current Skills</label>
                    <textarea
                        id="current_skills"
                        value={currentSkills}
                        onChange={(e) => setCurrentSkills(e.target.value)}
                        placeholder="List your current skills, separated by commas..."
                        className="w-full h-24 p-4 bg-slate-900 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none text-slate-300 resize-y"
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <label htmlFor="skill_gaps" className="block text-sm font-medium text-slate-300 mb-1">Skills You Want to Learn</label>
                    <textarea
                        id="skill_gaps"
                        value={skillGaps}
                        onChange={(e) => setSkillGaps(e.target.value)}
                        placeholder="List the skills you need or want to acquire..."
                        className="w-full h-24 p-4 bg-slate-900 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none text-slate-300 resize-y"
                        disabled={isLoading}
                    />
                </div>
                
                <div className="pt-2 flex items-center justify-between">
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
                                Generating Plan...
                            </>
                        ) : (
                            'Generate Learning Plan'
                        )}
                    </button>
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                </div>
            </div>
        </div>
    );
};
