import { getJobById } from '@/lib/mock-data';
import { JobDetailClient } from '@/components/jobs/JobDetailClient';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = await getJobById(params.id);
  if (!job) {
    return {
      title: 'Job Not Found | JobTrack'
    }
  }
  return {
    title: `${job.title} | JobTrack`,
    description: `Apply for ${job.title} at ${job.location}. ${job.description.substring(0, 100)}...`,
  };
}

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const job = await getJobById(params.id);

  if (!job) {
    notFound();
  }

  return <JobDetailClient job={job} />;
}
