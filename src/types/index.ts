export interface Job {
  id: string;
  title: string;
  location: string;
  description: string;
  requirements: string[];
  deadline: string; // ISO date string
  status: 'Open' | 'Closed';
  pipelineId: string; // References a Pipeline
  postedDate: string; // ISO date string
}

export interface Applicant {
  id: string;
  name: string;
  email: string;
  phone?: string;
  resumeUrl?: string; // URL to resume file or filename
  resumeText?: string; // For AI screening
  password?: string; // For simulated authentication
  isAdmin?: boolean; // For admin role
}

export interface Application {
  id:string;
  jobId: string;
  applicantId: string; 
  applicantName: string;
  applicantEmail: string;
  submissionDate: string; // ISO date string
  currentStage: string;
  statusHistory: Array<{ stage: string; date: string; notes?: string }>;
  resumeUrl?: string; // Added to hold resume filename for admin view
}

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
}
export interface Pipeline {
  id:string;
  name: string;
  stages: PipelineStage[]; // e.g., ['Application Received', 'Initial Screening', 'Interview', 'Offer', 'Hired']
}

// Add User type, which can be largely similar to Applicant for now
export type User = Applicant;

