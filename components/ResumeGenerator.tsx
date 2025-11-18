
import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { featuresData } from '../constants';
import type { ResumeData, ExperienceEntry, EducationEntry } from '../types';
import { ResumeDisplay } from './ResumeDisplay';

const systemInstruction = `You are the CareerOS Resume Generator, an AI specialized in creating professional, ATS-friendly, and role-targeted resumes. Your task is to take the user’s extracted skills, experience, achievements, and target career paths, and generate a polished, high-impact resume that highlights strengths, quantifies achievements, and aligns perfectly with the target roles.

Your responsibilities:
1. **Professional Summary**: Write a concise 2–3 sentence summary.
2. **Skills Section**: Organize skills into categories (Hard Skills, Soft Skills, Tools).
3. **Experience Section**: Use the STAR method for achievements and quantify results.
4. **Education Section**: Include degree, institution, and graduation year.
5. **ATS Optimization**: Include relevant keywords and use simple, scannable formatting.

**Output Requirements**:
- Primary output: A JSON object containing two keys: 'text_resume' (the complete resume in plain text) and 'html_resume' (a well-structured, styled HTML version of the resume).
- Ensure clarity, conciseness, and a professional tone. The HTML should be self-contained and use inline styles or a style tag.`;

const initialResumeData: ResumeData = {
    contact: { name: 'Jane Doe', email: 'jane.doe@email.com', phone: '123-456-7890', linkedin: 'linkedin.com/in/janedoe' },
    summary: 'A highly motivated and detail-oriented professional with 5 years of experience in project management and data analysis. Seeking to leverage strong analytical and problem-solving skills to contribute to a dynamic team.',
    skills: {
        hard_skills: 'Project Management, Data Analysis, SQL, Python, Agile Methodologies',
        soft_skills: 'Communication, Teamwork, Problem-Solving, Leadership',
        tools: 'Jira, Trello, Asana, Microsoft Office Suite, Tableau'
    },
    experience: [
        { id: crypto.randomUUID(), title: 'Project Manager', company: 'Tech Solutions Inc.', location: 'San Francisco, CA', dates: 'Jan 2021 – Present', achievements: ['Led a team of 5 to successfully deliver a major software project 2 weeks ahead of schedule.', 'Reduced project costs by 15% through strategic resource allocation.'] }
    ],
    education: [
        { id: crypto.randomUUID(), degree: 'B.S. in Business Administration', institution: 'State University', year: '2019' }
    ],
    target_role: 'Senior Project Manager'
};

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        text_resume: { type: Type.STRING, description: 'The complete resume formatted as plain text.' },
        html_resume: { type: Type.STRING, description: 'The complete resume formatted as a self-contained HTML document.' }
    },
    required: ['text_resume', 'html_resume']
};

export const ResumeGenerator: React.FC = () => {
    const [formData, setFormData] = useState<ResumeData>(initialResumeData);
    const [isLoading, setIsLoading] = useState(false);
    const [generatedResume, setGeneratedResume] = useState<{ text: string; html: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    const resumeFeature = featuresData.find(f => f.id === 'resume');

    // FIX: Narrowed the type of `section` to only include keys of ResumeData that are objects, fixing the spread operator error.
    const handleInputChange = (section: 'contact' | 'skills', field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }));
    };
    
    const handleExperienceChange = (id: string, field: keyof ExperienceEntry, value: string | string[]) => {
        setFormData(prev => ({
            ...prev,
            experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
        }));
    };

    const addExperience = () => {
        setFormData(prev => ({
            ...prev,
            experience: [...prev.experience, { id: crypto.randomUUID(), title: '', company: '', location: '', dates: '', achievements: [''] }]
        }));
    };

    const removeExperience = (id: string) => {
        setFormData(prev => ({
            ...prev,
            experience: prev.experience.filter(exp => exp.id !== id)
        }));
    };
    
    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        setGeneratedResume(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const payload = {
                ...formData,
                skills: {
                    hard_skills: formData.skills.hard_skills.split(',').map(s => s.trim()),
                    soft_skills: formData.skills.soft_skills.split(',').map(s => s.trim()),
                    tools: formData.skills.tools.split(',').map(s => s.trim()),
                }
            };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: `Generate a resume based on this data: ${JSON.stringify(payload)}`,
                config: {
                    systemInstruction,
                    responseMimeType: 'application/json',
                    responseSchema: responseSchema,
                },
            });
            
            const resultJson = JSON.parse(response.text);
            setGeneratedResume({ text: resultJson.text_resume, html: resultJson.html_resume });

        } catch (e) {
            console.error(e);
            setError('An error occurred while generating the resume. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (generatedResume) {
        return <ResumeDisplay resume={generatedResume} onReset={() => setGeneratedResume(null)} />;
    }

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-slate-100 flex items-center gap-4">
                    {resumeFeature?.icon && <resumeFeature.icon className="h-8 w-8 text-sky-400" />}
                    {resumeFeature?.title}
                </h1>
                <p className="text-slate-400 mt-2 max-w-3xl">{resumeFeature?.description} Fill in your details below and our AI will craft a professional resume for you.</p>
            </header>

            <div className="space-y-6 bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                {/* --- Target Role --- */}
                <div>
                    <label htmlFor="target_role" className="block text-sm font-medium text-sky-400 mb-1">Target Role</label>
                    <input type="text" id="target_role" value={formData.target_role} onChange={e => setFormData(p => ({...p, target_role: e.target.value}))} className="w-full bg-slate-900 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"/>
                </div>
                
                {/* --- Contact Info --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div><label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label><input type="text" value={formData.contact.name} onChange={e => handleInputChange('contact', 'name', e.target.value)} className="w-full bg-slate-700 border-slate-600 rounded-md p-2"/></div>
                     <div><label className="block text-sm font-medium text-slate-300 mb-1">Email</label><input type="email" value={formData.contact.email} onChange={e => handleInputChange('contact', 'email', e.target.value)} className="w-full bg-slate-700 border-slate-600 rounded-md p-2"/></div>
                     <div><label className="block text-sm font-medium text-slate-300 mb-1">Phone</label><input type="tel" value={formData.contact.phone} onChange={e => handleInputChange('contact', 'phone', e.target.value)} className="w-full bg-slate-700 border-slate-600 rounded-md p-2"/></div>
                     <div><label className="block text-sm font-medium text-slate-300 mb-1">LinkedIn Profile URL</label><input type="text" value={formData.contact.linkedin} onChange={e => handleInputChange('contact', 'linkedin', e.target.value)} className="w-full bg-slate-700 border-slate-600 rounded-md p-2"/></div>
                </div>

                {/* --- Professional Summary --- */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Professional Summary</label>
                    <textarea value={formData.summary} onChange={e => setFormData(p => ({...p, summary: e.target.value}))} rows={3} className="w-full bg-slate-700 border-slate-600 rounded-md p-2" />
                </div>
                
                {/* --- Skills --- */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Skills (comma-separated)</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input type="text" placeholder="Hard Skills" value={formData.skills.hard_skills} onChange={e => handleInputChange('skills', 'hard_skills', e.target.value)} className="w-full bg-slate-700 border-slate-600 rounded-md p-2" />
                        <input type="text" placeholder="Soft Skills" value={formData.skills.soft_skills} onChange={e => handleInputChange('skills', 'soft_skills', e.target.value)} className="w-full bg-slate-700 border-slate-600 rounded-md p-2" />
                        <input type="text" placeholder="Tools & Technologies" value={formData.skills.tools} onChange={e => handleInputChange('skills', 'tools', e.target.value)} className="w-full bg-slate-700 border-slate-600 rounded-md p-2" />
                    </div>
                </div>
                
                {/* --- Experience --- */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-200 border-b border-slate-600 pb-2">Work Experience</h3>
                    {formData.experience.map((exp, index) => (
                        <div key={exp.id} className="p-4 bg-slate-900/50 rounded-md border border-slate-700 relative">
                             <button onClick={() => removeExperience(exp.id)} className="absolute top-2 right-2 text-slate-500 hover:text-red-400">&times;</button>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                                <input type="text" placeholder="Job Title" value={exp.title} onChange={e => handleExperienceChange(exp.id, 'title', e.target.value)} className="w-full bg-slate-700 border-slate-600 rounded-md p-2" />
                                <input type="text" placeholder="Company" value={exp.company} onChange={e => handleExperienceChange(exp.id, 'company', e.target.value)} className="w-full bg-slate-700 border-slate-600 rounded-md p-2" />
                                <input type="text" placeholder="Location" value={exp.location} onChange={e => handleExperienceChange(exp.id, 'location', e.target.value)} className="w-full bg-slate-700 border-slate-600 rounded-md p-2" />
                                <input type="text" placeholder="Dates (e.g., Jan 2021 - Present)" value={exp.dates} onChange={e => handleExperienceChange(exp.id, 'dates', e.target.value)} className="w-full bg-slate-700 border-slate-600 rounded-md p-2" />
                            </div>
                            <textarea placeholder="Achievements (one per line)" value={exp.achievements.join('\n')} onChange={e => handleExperienceChange(exp.id, 'achievements', e.target.value.split('\n'))} rows={3} className="w-full bg-slate-700 border-slate-600 rounded-md p-2" />
                        </div>
                    ))}
                    <button onClick={addExperience} className="text-sm text-sky-400 hover:text-sky-300 font-semibold">+ Add Experience</button>
                </div>
                
                 {/* --- Education --- */}
                 <div className="space-y-2">
                     <h3 className="text-lg font-semibold text-slate-200 border-b border-slate-600 pb-2">Education</h3>
                      {formData.education.map((edu, index) => (
                         <div key={edu.id} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             <input type="text" placeholder="Degree" value={edu.degree} onChange={e => setFormData(p => ({...p, education: p.education.map(ed => ed.id === edu.id ? {...ed, degree: e.target.value} : ed)}))} className="w-full bg-slate-700 border-slate-600 rounded-md p-2" />
                             <input type="text" placeholder="Institution" value={edu.institution} onChange={e => setFormData(p => ({...p, education: p.education.map(ed => ed.id === edu.id ? {...ed, institution: e.target.value} : ed)}))} className="w-full bg-slate-700 border-slate-600 rounded-md p-2" />
                             <input type="text" placeholder="Year of Graduation" value={edu.year} onChange={e => setFormData(p => ({...p, education: p.education.map(ed => ed.id === edu.id ? {...ed, year: e.target.value} : ed)}))} className="w-full bg-slate-700 border-slate-600 rounded-md p-2" />
                         </div>
                      ))}
                 </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
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
                            Generating...
                        </>
                    ) : 'Generate My Resume' }
                </button>
                 {error && <p className="text-red-400 text-sm">{error}</p>}
            </div>
        </div>
    );
};
