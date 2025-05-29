// src/ai/flows/applicant-screener.ts
'use server';

/**
 * @fileOverview AI-powered applicant screener flow.
 *
 * - screenApplicants - Screens applicants based on skills in the job posting.
 * - ScreenApplicantsInput - The input type for the screenApplicants function.
 * - ScreenApplicantsOutput - The return type for the screenApplicants function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ApplicantSchema = z.object({
  name: z.string().describe('Applicant name'),
  resumeText: z.string().describe('Text extracted from applicant resume'),
});

const JobPostingSchema = z.object({
  title: z.string().describe('Job title'),
  description: z.string().describe('Full job description'),
  skills: z.array(z.string()).describe('Array of required skills'),
});

const ScreenApplicantsInputSchema = z.object({
  jobPosting: JobPostingSchema.describe('Job posting details, including required skills'),
  applicants: z.array(ApplicantSchema).describe('Array of applicant details'),
});
export type ScreenApplicantsInput = z.infer<typeof ScreenApplicantsInputSchema>;

const ApplicantAssessmentSchema = z.object({
  name: z.string().describe('Applicant name'),
  match: z.boolean().describe('Whether the applicant is a good match for the job (true) or not (false).'),
  reason: z.string().describe('The reason for the match assessment.'),
});

const ScreenApplicantsOutputSchema = z.object({
  assessments: z.array(ApplicantAssessmentSchema).describe('Array of applicant assessments'),
});
export type ScreenApplicantsOutput = z.infer<typeof ScreenApplicantsOutputSchema>;

export async function screenApplicants(input: ScreenApplicantsInput): Promise<ScreenApplicantsOutput> {
  return screenApplicantsFlow(input);
}

const screenApplicantsPrompt = ai.definePrompt({
  name: 'screenApplicantsPrompt',
  input: {schema: ScreenApplicantsInputSchema},
  output: {schema: ScreenApplicantsOutputSchema},
  prompt: `You are an AI recruiter tasked with screening applicants for a job.

Job Posting:
Title: {{{jobPosting.title}}}
Description: {{{jobPosting.description}}}
Required Skills: {{#each jobPosting.skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Applicants:
{{#each applicants}}
  Name: {{{name}}}
  Resume Text: {{{resumeText}}}
{{/each}}

Assess each applicant based on their resume and the job posting, determining if they are a good match.
Explain your reasoning for each applicant.

Output should be a JSON array of applicant assessments, with each assessment including the applicant's name, a boolean indicating match/no match, and the reason for the assessment.

Example Output:
{
  "assessments": [
    {
      "name": "John Doe",
      "match": true,
      "reason": "John Doe's resume demonstrates strong proficiency in the required skills."
    },
    {
      "name": "Jane Smith",
      "match": false,
      "reason": "Jane Smith's resume does not show sufficient experience in the required skills."
    }
  ]
}

Follow the example output format PRECISELY, and nothing else.  Do not return natural language.
`,
});

const screenApplicantsFlow = ai.defineFlow(
  {
    name: 'screenApplicantsFlow',
    inputSchema: ScreenApplicantsInputSchema,
    outputSchema: ScreenApplicantsOutputSchema,
  },
  async input => {
    const {output} = await screenApplicantsPrompt(input);
    return output!;
  }
);
