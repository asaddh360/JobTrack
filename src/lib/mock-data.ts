import type { Job, Applicant, Application, Pipeline } from '@/types';

export const mockPipelines: Pipeline[] = [
  {
    id: 'pipeline-standard',
    name: 'Standard Hiring Pipeline',
    stages: [
      { id: 's1', name: 'Application Received', order: 1 },
      { id: 's2', name: 'AI Screening', order: 2 },
      { id: 's3', name: 'HR Review', order: 3 },
      { id: 's4', name: 'Technical Interview', order: 4 },
      { id: 's5', name: 'Final Interview', order: 5 },
      { id: 's6', name: 'Offer Extended', order: 6 },
      { id: 's7', name: 'Hired', order: 7 },
      { id: 's8', name: 'Rejected', order: 8 },
    ],
  },
  {
    id: 'pipeline-intern',
    name: 'Internship Pipeline',
    stages: [
      { id: 'i1', name: 'Application In', order: 1 },
      { id: 'i2', name: 'Portfolio Review', order: 2 },
      { id: 'i3', name: 'Screening Call', order: 3 },
      { id: 'i4', name: 'Assignment', order: 4 },
      { id: 'i5', name: 'Offer', order: 5 },
    ],
  },
];

export const mockJobs: Job[] = [
  {
    id: 'job-1',
    title: 'Frontend Developer',
    location: 'Remote',
    description: 'Join our team to build amazing user interfaces. We are looking for a skilled Frontend Developer proficient in React and Next.js.',
    requirements: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    status: 'Open',
    pipelineId: 'pipeline-standard',
    postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
  {
    id: 'job-2',
    title: 'Backend Developer',
    location: 'New York, NY',
    description: 'We need an experienced Backend Developer to design and maintain our server-side logic. Expertise in Node.js and PostgreSQL is required.',
    requirements: ['Node.js', 'Express.js', 'PostgreSQL', 'Docker'],
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
    status: 'Open',
    pipelineId: 'pipeline-standard',
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: 'job-3',
    title: 'UX Designer Intern',
    location: 'San Francisco, CA',
    description: 'Exciting internship opportunity for a budding UX Designer. Work on real-world projects and gain valuable experience.',
    requirements: ['Figma', 'User Research', 'Prototyping'],
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    status: 'Open',
    pipelineId: 'pipeline-intern',
    postedDate: new Date().toISOString(),
  },
   {
    id: 'job-4',
    title: 'Product Manager',
    location: 'Austin, TX',
    description: 'Lead product strategy and execution for our innovative platform. Strong analytical and communication skills needed.',
    requirements: ['Agile', 'Roadmapping', 'Market Analysis', 'JIRA'],
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Open',
    pipelineId: 'pipeline-standard',
    postedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockApplicants: Applicant[] = [
  {
    id: 'applicant-1',
    name: 'Alice Wonderland',
    email: 'alice@example.com',
    resumeText: 'Experienced Frontend Developer with 5 years in React, Next.js, and TypeScript. Proven ability to deliver high-quality user interfaces. Familiar with Tailwind CSS.',
    coverLetter: 'I am very interested in the Frontend Developer position.',
  },
  {
    id: 'applicant-2',
    name: 'Bob The Builder',
    email: 'bob@example.com',
    resumeText: 'Skilled Backend Engineer specializing in Node.js and microservices architecture. Proficient in PostgreSQL and Docker containerization. 3 years of experience.',
    coverLetter: 'The Backend Developer role aligns perfectly with my skills.',
  },
  {
    id: 'applicant-3',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    resumeText: 'Aspiring UX Designer, proficient in Figma and passionate about user-centered design. Eager to learn and contribute.',
    coverLetter: 'I am excited about the UX Designer Internship opportunity.',
  },
  {
    id: 'applicant-4',
    name: 'Diana Prince',
    email: 'diana@example.com',
    resumeText: 'Senior Frontend Developer with expertise in Vue.js and Angular. Some experience with React.',
    coverLetter: 'Looking for challenging frontend roles.',
  }
];

export const mockApplications: Application[] = [
  {
    id: 'app-1',
    jobId: 'job-1',
    applicantId: 'applicant-1',
    applicantName: 'Alice Wonderland',
    applicantEmail: 'alice@example.com',
    submissionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    currentStage: 'AI Screening',
    statusHistory: [
      { stage: 'Application Received', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
      { stage: 'AI Screening', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    ],
    aiScreeningResult: {
      match: true,
      reason: "Strong match for required skills: React, Next.js, TypeScript, Tailwind CSS.",
    }
  },
  {
    id: 'app-2',
    jobId: 'job-2',
    applicantId: 'applicant-2',
    applicantName: 'Bob The Builder',
    applicantEmail: 'bob@example.com',
    submissionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    currentStage: 'Application Received',
    statusHistory: [
      { stage: 'Application Received', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    ],
  },
  {
    id: 'app-3',
    jobId: 'job-1',
    applicantId: 'applicant-4',
    applicantName: 'Diana Prince',
    applicantEmail: 'diana@example.com',
    submissionDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    currentStage: 'AI Screening',
    statusHistory: [
        { stage: 'Application Received', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
        { stage: 'AI Screening', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
    ],
    aiScreeningResult: {
        match: false,
        reason: "Primary experience in Vue.js and Angular, not React/Next.js as required.",
    }
  }
];

// Basic CRUD operations for mock data (client-side simulation)
// In a real app, these would be API calls.

export const getJobs = async (): Promise<Job[]> => {
  return new Promise(resolve => setTimeout(() => resolve(mockJobs), 500));
};

export const getJobById = async (id: string): Promise<Job | undefined> => {
  return new Promise(resolve => setTimeout(() => resolve(mockJobs.find(job => job.id === id)), 300));
};

export const addJob = async (job: Omit<Job, 'id' | 'postedDate'>): Promise<Job> => {
  const newJob: Job = { ...job, id: `job-${Date.now()}`, postedDate: new Date().toISOString() };
  mockJobs.push(newJob);
  return new Promise(resolve => setTimeout(() => resolve(newJob), 300));
};

export const updateJob = async (job: Job): Promise<Job | undefined> => {
  const index = mockJobs.findIndex(j => j.id === job.id);
  if (index !== -1) {
    mockJobs[index] = job;
    return new Promise(resolve => setTimeout(() => resolve(job), 300));
  }
  return undefined;
};


export const getApplicationsForJob = async (jobId: string): Promise<Application[]> => {
  return new Promise(resolve => setTimeout(() => resolve(mockApplications.filter(app => app.jobId === jobId)), 300));
};

export const getApplicationsForUser = async (userEmail: string): Promise<Application[]> => {
  // Assuming user is identified by email for simplicity
  return new Promise(resolve => setTimeout(() => resolve(mockApplications.filter(app => app.applicantEmail === userEmail)), 300));
};

export const addApplication = async (applicationData: Omit<Application, 'id' | 'submissionDate' | 'currentStage' | 'statusHistory'>, applicantData: Omit<Applicant, 'id'>): Promise<Application> => {
  let applicant = mockApplicants.find(a => a.email === applicantData.email);
  if (!applicant) {
    applicant = { ...applicantData, id: `applicant-${Date.now()}`};
    mockApplicants.push(applicant);
  }

  const newApplication: Application = {
    ...applicationData,
    id: `app-${Date.now()}`,
    applicantId: applicant.id,
    submissionDate: new Date().toISOString(),
    currentStage: mockPipelines.find(p => p.id === mockJobs.find(j=>j.id === applicationData.jobId)?.pipelineId)?.stages[0]?.name || 'Application Received',
    statusHistory: [{ stage: mockPipelines.find(p => p.id === mockJobs.find(j=>j.id === applicationData.jobId)?.pipelineId)?.stages[0]?.name || 'Application Received', date: new Date().toISOString() }],
  };
  mockApplications.push(newApplication);
  return new Promise(resolve => setTimeout(() => resolve(newApplication), 300));
};

export const updateApplicationStage = async (applicationId: string, newStage: string): Promise<Application | undefined> => {
  const appIndex = mockApplications.findIndex(app => app.id === applicationId);
  if (appIndex !== -1) {
    mockApplications[appIndex].currentStage = newStage;
    mockApplications[appIndex].statusHistory.push({ stage: newStage, date: new Date().toISOString() });
    return new Promise(resolve => setTimeout(() => resolve(mockApplications[appIndex]), 300));
  }
  return undefined;
}

export const getApplicantById = async (id: string): Promise<Applicant | undefined> => {
  return new Promise(resolve => setTimeout(() => resolve(mockApplicants.find(app => app.id === id)), 300));
};


export const getPipelines = async (): Promise<Pipeline[]> => {
  return new Promise(resolve => setTimeout(() => resolve(mockPipelines), 200));
}

export const getPipelineById = async (id: string): Promise<Pipeline | undefined> => {
  return new Promise(resolve => setTimeout(() => resolve(mockPipelines.find(p => p.id === id)), 200));
}

export const addPipeline = async (pipeline: Omit<Pipeline, 'id'>): Promise<Pipeline> => {
  const newPipeline: Pipeline = { ...pipeline, id: `pipeline-${Date.now()}` };
  mockPipelines.push(newPipeline);
  return new Promise(resolve => setTimeout(() => resolve(newPipeline), 300));
}

export const updatePipeline = async (pipeline: Pipeline): Promise<Pipeline | undefined> => {
  const index = mockPipelines.findIndex(p => p.id === pipeline.id);
  if (index !== -1) {
    mockPipelines[index] = pipeline;
    return new Promise(resolve => setTimeout(() => resolve(pipeline), 300));
  }
  return undefined;
}

export const addAiScreeningResult = async (applicationId: string, screeningResult: Application['aiScreeningResult']): Promise<Application | undefined> => {
  const appIndex = mockApplications.findIndex(app => app.id === applicationId);
  if (appIndex !== -1) {
    mockApplications[appIndex].aiScreeningResult = screeningResult;
    // Optionally move to next stage after AI screening
    // const pipeline = mockPipelines.find(p => p.id === mockJobs.find(j => j.id === mockApplications[appIndex].jobId)?.pipelineId);
    // if (pipeline) {
    //   const currentStageIndex = pipeline.stages.findIndex(s => s.name === mockApplications[appIndex].currentStage);
    //   if (pipeline.stages[currentStageIndex]?.name === 'AI Screening' && pipeline.stages[currentStageIndex + 1]) {
    //      mockApplications[appIndex].currentStage = pipeline.stages[currentStageIndex+1].name;
    //      mockApplications[appIndex].statusHistory.push({ stage: mockApplications[appIndex].currentStage, date: new Date().toISOString(), notes: "Automatically moved after AI screening." });
    //   }
    // }
    return new Promise(resolve => setTimeout(() => resolve(mockApplications[appIndex]), 300));
  }
  return undefined;
};
