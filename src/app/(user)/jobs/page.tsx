import { JobListings } from '@/components/jobs/JobListings';

export const metadata = {
  title: 'Job Listings | JobTrack',
  description: 'Find open positions and apply for jobs.',
};

export default function JobsPage() {
  return <JobListings />;
}
