
import React from 'react';

export interface Feature {
  id: string;
  title: string;
  description:string;
  icon: React.FC<{ className?: string }>;
}

export interface Skills {
  hard_skills: string[];
  soft_skills: string[];
  tools: string[];
  certifications: string[];
  experience: { role: string; company: string; duration: string; achievements: string[] }[];
}

export interface RecommendedRole {
  role: string;
  match_score: number;
  required_skills: string[];
  missing_skills: string[];
  justification: string;
}

export interface SkillGap {
  skill: string;
  type: 'technical' | 'behavioral' | 'domain-specific';
  suggestion: string;
}

export interface CareerRoadmap {
  '30_days': string[];
  '60_days': string[];
  '90_days': string[];
}

export interface AnalysisResult {
  career_persona: string;
  skills: Skills;
  recommended_roles: RecommendedRole[];
  skill_gaps: SkillGap[];
  career_roadmap: CareerRoadmap;
  resume: string;
}

// Types for Resume Generator
export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
}

export interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  location: string;
  dates: string;
  achievements: string[];
}

export interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

export interface ResumeData {
  contact: ContactInfo;
  summary: string;
  skills: {
    hard_skills: string;
    soft_skills: string;
    tools: string;
  };
  experience: ExperienceEntry[];
  education: EducationEntry[];
  target_role: string;
}

// Types for Job Matching
export interface RecommendedJobRole {
  role: string;
  match_score: number;
  required_skills: string[];
  missing_skills: string[];
  justification: string;
  industry_suggestions: string[];
  salary_range: string;
}

export interface JobMatchResult {
  recommended_roles: RecommendedJobRole[];
}

// Types for Video Interview Analyzer
export interface PersonalityTraits {
  confidence: string;
  leadership: string;
  adaptability: string;
  teamwork: string;
  creativity: string;
}

export interface RoleAlignment {
  role: string;
  match_score: number;
  justification: string;
}

export interface InterviewAnalysisResult {
  transcript_summary: string;
  communication_score: number;
  personality_traits: PersonalityTraits;
  soft_skills_feedback: string[];
  role_alignment: RoleAlignment[];
  recommended_actions: string[];
}

// Types for Salary Prediction
export interface EstimatedSalaryRange {
  min: number;
  average: number;
  max: number;
}

export interface SalaryPredictionResult {
  role: string;
  location: string;
  estimated_salary_range: EstimatedSalaryRange;
  justification: string;
  skills_impacting_salary: string[];
  recommendations_to_increase_salary: string[];
}

// Types for Personalized Upskilling
export interface LearningPathMilestone {
  milestone: string;
  skills_to_learn: string[];
  recommended_courses: string[];
  projects: string[];
  measurable_goals: string[];
}

export interface UpskillingResult {
  learning_path: LearningPathMilestone[];
}

// Types for Enterprise Dashboard
export interface EmployeeProfile {
  id: string;
  name: string;
  role: string;
  department: string;
  skills: string[];
  experience_years: number;
}

export interface DepartmentAnalytics {
  name: string;
  skills_summary: {
    skill: string;
    count: number;
  }[];
  top_employees: {
    name: string;
    reason: string;
  }[];
  skills_gaps: string[];
  upskilling_recommendations: string[];
  career_mobility_opportunities: string[];
}

export interface EnterpriseDashboardResult {
  departments: DepartmentAnalytics[];
}

// Types for Skills Analytics
export interface SkillsSummary {
  hard_skills: string[];
  soft_skills: string[];
  tools: string[];
  certifications: string[];
  domain_expertise: string[];
}

export interface SkillBasedRoleAlignment {
  role: string;
  match_score: number;
  missing_skills: string[];
  justification: string;
}

export interface SkillsAnalysisResult {
  skills_summary: SkillsSummary;
  strengths: string[];
  skill_gaps: string[];
  role_alignment: SkillBasedRoleAlignment[];
  upskilling_recommendations: string[];
}

// Types for Talent Mobility Engine
export interface InternalOpportunity {
  role_or_project: string;
  match_score: number;
  justification: string;
  skills_to_develop: string[];
}

export interface PotentialCareerPath {
  path_name: string;
  next_steps: string[];
  development_plan: string[];
}

export interface RetentionRisk {
  level: 'Low' | 'Medium' | 'High';
  reason: string;
}

export interface TalentMobilityResult {
  employee_summary: {
    name: string;
    current_role: string;
  };
  internal_opportunities: InternalOpportunity[];
  potential_career_paths: PotentialCareerPath[];
  retention_risk: RetentionRisk;
  mobility_recommendations: string[];
}

// Types for Career Marketplace
export interface RecommendedOpportunity {
  role: string;
  organization: string;
  match_score: number;
  required_skills: string[];
  missing_skills: string[];
  justification: string;
  location: string;
  salary_range: string;
  career_growth_potential: string;
}

export interface CareerMarketplaceResult {
  recommended_opportunities: RecommendedOpportunity[];
}

// Types for API Integrations
export interface LinkedInExperience {
    title: string;
    company: string;
    location: string;
    dates: string;
    achievements: string[];
}

export interface LinkedInEducation {
    degree: string;
    institution: string;
    year: string;
}

export interface LinkedInProfile {
    status: string;
    message: string;
    data: {
        skills: {
            hard_skills: string[];
            soft_skills: string[];
            tools: string[];
            certifications: string[];
        };
        experience: LinkedInExperience[];
        education: LinkedInEducation[];
        career_goals: string[];
    };
}
