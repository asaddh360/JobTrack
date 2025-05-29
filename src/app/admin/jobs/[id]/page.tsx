import { getJobById } from '@/lib/mock-data';
import { AdminJobEditor } from '@/components/admin/AdminJobEditor';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = await getJobById(params.id);
   if (!job) {
    return {
      title: 'Job Not Found | JobTrack Admin'
    }
  }
  return {
    title: `Edit Job: ${job.title} | JobTrack Admin`,
    description: `Manage applicants and details for the job: ${job.title}.`,
  };
}


export default async function EditJobPage({ params }: { params: { id: string } }) {
  const job = await getJobById(params.id);

  if (!job) {
    notFound();
  }

  return <AdminJobEditor job={job} />;
}
