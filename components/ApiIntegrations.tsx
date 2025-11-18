
import React, { useState } from 'react';
import { featuresData } from '../constants';
import type { LinkedInProfile } from '../types';
import { CodeBlock } from './CodeBlock';

const sampleLinkedInData: LinkedInProfile = {
    status: "success",
    message: "LinkedIn profile successfully fetched and formatted.",
    data: {
        skills: {
            hard_skills: ["Product Management", "Agile Methodologies", "Roadmapping", "Market Analysis"],
            soft_skills: ["Leadership", "Communication", "Strategic Thinking", "Cross-functional Collaboration"],
            tools: ["Jira", "Confluence", "Looker", "Figma"],
            certifications: ["Certified Scrum Product Owner (CSPO)"]
        },
        experience: [
            {
                title: "Senior Product Manager",
                company: "Innovate Inc.",
                location: "New York, NY",
                dates: "Jan 2020 – Present",
                achievements: [
                    "Led the development and launch of a new mobile application, resulting in a 30% increase in user engagement.",
                    "Defined the product roadmap and strategy for the company's flagship SaaS product, aligning with business goals and customer needs."
                ]
            },
            {
                title: "Product Manager",
                company: "Tech Solutions LLC",
                location: "New York, NY",
                dates: "Jun 2017 – Dec 2019",
                achievements: [
                    "Managed the entire product lifecycle from concept to launch for three major features.",
                    "Conducted user research and data analysis to inform product decisions, leading to a 15% improvement in user satisfaction."
                ]
            }
        ],
        education: [
            {
                degree: "Bachelor of Science in Computer Science",
                institution: "State University",
                year: "2017"
            }
        ],
        career_goals: [
            "Transition into a Director of Product role within the next 3-5 years.",
            "Specialize in AI-powered enterprise software.",
            "Mentor aspiring product managers."
        ]
    }
};

const LinkedInIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-4.481 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
    </svg>
);


export const ApiIntegrations: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const feature = featuresData.find(f => f.id === 'api');

    const handleConnect = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsConnected(true);
        }, 1500);
    };

    const handleDisconnect = () => {
        setIsConnected(false);
    };

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
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-[#0077B5] p-3 rounded-lg text-white">
                            <LinkedInIcon />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-100">LinkedIn</h3>
                            <p className="text-sm text-slate-400">Sync your profile to automatically populate your skills, experience, and education.</p>
                        </div>
                    </div>
                    
                    {!isConnected ? (
                        <button
                            onClick={handleConnect}
                            disabled={isLoading}
                            className="px-5 py-2.5 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
                        >
                            {isLoading ? 'Connecting...' : 'Connect'}
                        </button>
                    ) : (
                        <div className="flex items-center gap-4">
                             <div className="flex items-center gap-2 text-green-400">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                <span className="font-semibold text-sm">Connected</span>
                            </div>
                            <button
                                onClick={handleDisconnect}
                                className="px-4 py-2 bg-slate-700 text-slate-300 font-semibold text-sm rounded-md hover:bg-slate-600 transition-colors"
                            >
                                Disconnect
                            </button>
                        </div>
                    )}
                </div>

                {isConnected && (
                    <div className="mt-6 border-t border-slate-700 pt-6">
                        <h4 className="text-lg font-semibold text-slate-200 mb-2">Fetched Profile Data</h4>
                        <p className="text-sm text-slate-400 mb-4">
                            This is a sample of the structured data automatically imported from your profile. You can now use this data in other CareerOS tools like the Resume Generator or Skills Analytics.
                        </p>
                        <CodeBlock code={JSON.stringify(sampleLinkedInData, null, 2)} />
                    </div>
                )}
            </div>
        </div>
    );
};
