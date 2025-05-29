import { AdminJobList } from '@/components/admin/AdminJobList';

export const metadata = {
  title: 'Manage Jobs | JobTrack Admin',
  description: 'Administer job postings, view applicants, and manage hiring pipelines.',
};

export default function AdminJobsPage() {
  return <AdminJobList />;
}
