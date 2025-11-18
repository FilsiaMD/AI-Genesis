

import React from 'react';
import type { Feature } from './types';

// Icon Components
// FIX: Rewrote icon components using React.createElement to fix JSX parsing errors in a .ts file.
const AssessmentIcon: React.FC<{ className?: string }> = (props) => (
  React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23-.693L4.2 15.3m15.6 0-1.57.393m0 0a9.065 9.065 0 0 1-9.46 0l-1.57-.393M12 21a9.065 9.065 0 0 1-9.46 0l-1.57.393m1.57-.393L2.2 15.3m19.6.393-1.57-.393" })
  )
);
const ResumeIcon: React.FC<{ className?: string }> = (props) => (
  React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" })
  )
);
const JobMatchIcon: React.FC<{ className?: string }> = (props) => (
  React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" })
  )
);
const VideoAnalyzerIcon: React.FC<{ className?: string }> = (props) => (
  React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9A2.25 2.25 0 0 0 13.5 5.25h-9A2.25 2.25 0 0 0 2.25 7.5v9A2.25 2.25 0 0 0 4.5 18.75Z" })
  )
);
const SalaryPredictionIcon: React.FC<{ className?: string }> = (props) => (
  React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v1.5m-1.5-.75V6.75m0 0v1.5m0 0v1.5m0 0V15m0 0v.75c0 .414-.336.75-.75.75h-.75m1.5-1.5h-.375c-.621 0-1.125-.504-1.125-1.125v-1.5m1.5.75v-1.5m0 0V9m0 0V7.5" })
  )
);
const UpskillingIcon: React.FC<{ className?: string }> = (props) => (
  React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" },
    React.createElement('path', { d: "M12 14l9-5-9-5-9 5 9 5z" }),
    React.createElement('path', { d: "M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14z" }),
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" })
  )
);
const EnterpriseIcon: React.FC<{ className?: string }> = (props) => (
  React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6h1.5m-1.5 3h1.5m-1.5 3h1.5M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" })
  )
);
const AnalyticsIcon: React.FC<{ className?: string }> = (props) => (
  React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 0 1 3 21v-7.875M12.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v12.375c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625M21 4.125c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v16.875c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z", transform: "translate(-1.5 -1.5)" })
  )
);
const MobilityIcon: React.FC<{ className?: string }> = (props) => (
  React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" })
  )
);
const MarketplaceIcon: React.FC<{ className?: string }> = (props) => (
  React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.658-.463 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" })
  )
);
const ApiIcon: React.FC<{ className?: string }> = (props) => (
  React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" })
  )
);

export const featuresData: Feature[] = [
  {
    id: 'assessment',
    title: 'AI Career Assessment',
    description: 'Discover your strengths and ideal career paths with our intelligent assessment.',
    icon: AssessmentIcon,
  },
  {
    id: 'resume',
    title: 'Resume Generator',
    description: 'Build a professional, tailored resume in minutes with AI assistance.',
    icon: ResumeIcon,
  },
  {
    id: 'job-matching',
    title: 'Job Matching',
    description: 'Get matched with job opportunities that align perfectly with your profile.',
    icon: JobMatchIcon,
  },
  {
    id: 'interviews',
    title: 'Video Interview Analyzer',
    description: 'Practice interviews and get AI-driven feedback on your performance.',
    icon: VideoAnalyzerIcon,
  },
  {
    id: 'salary',
    title: 'Salary Prediction',
    description: 'Estimate your market value and negotiate your salary with confidence.',
    icon: SalaryPredictionIcon,
  },
  {
    id: 'upskilling',
    title: 'Personalized Upskilling',
    description: 'Receive custom learning paths to close your skill gaps and get ahead.',
    icon: UpskillingIcon,
  },
  {
    id: 'enterprise',
    title: 'Enterprise Dashboard',
    description: 'Manage your team\'s career growth and skills development from one place.',
    icon: EnterpriseIcon,
  },
  {
    id: 'analytics',
    title: 'Skills Analytics',
    description: 'Gain insights into your organization\'s skills landscape and talent pool.',
    icon: AnalyticsIcon,
  },
  {
    id: 'mobility',
    title: 'Talent Mobility Engine',
    description: 'Facilitate internal career moves and retain top talent within your company.',
    icon: MobilityIcon,
  },
  {
    id: 'marketplace',
    title: 'Career Marketplace',
    description: 'Connect with mentors, coaches, and training providers to boost your career.',
    icon: MarketplaceIcon,
  },
  {
    id: 'api',
    title: 'API Integrations',
    description: 'Connect our platform with your existing HR tools for a seamless workflow.',
    icon: ApiIcon,
  },
];