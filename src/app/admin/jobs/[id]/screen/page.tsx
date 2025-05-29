import { ApplicantScreenerClient } from '@/components/admin/ApplicantScreenerClient';
import { getJobById } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

type Props = {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = await getJobById(params.id);
   if (!job) {
    return {
      title: 'Job Not Found | JobTrack Admin'
    }
  }
  return {
    title: `AI Screener: ${job.title} | JobTrack Admin`,
    description: `Use AI to screen applicants for the job: ${job.title}.`,
  };
}

export default async function ApplicantScreenerPage({ params, searchParams }: Props) {
  const job = await getJobById(params.id);
  if (!job) {
    notFound();
  }
  const applicantId = typeof searchParams?.applicantId === 'string' ? searchParams.applicantId : undefined;

  return <ApplicantScreenerClient jobId={params.id} initialApplicantId={applicantId} />;
}
