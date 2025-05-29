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
  resumeUrl?: string; // URL to resume file or text content
  resumeText?: string; // For AI screening
  coverLetter?: string;
}

export interface Application {
  id:string;
  jobId: string;
  applicantId: string; // Could be embedded Applicant details
  applicantName: string;
  applicantEmail: string;
  submissionDate: string; // ISO date string
  currentStage: string;
  statusHistory: Array<{ stage: string; date: string; notes?: string }>;
  aiScreeningResult?: {
    match: boolean;
    reason: string;
    score?: number; // Optional: if AI provides a score
  };
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
