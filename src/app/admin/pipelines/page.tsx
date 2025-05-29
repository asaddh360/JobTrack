import { PipelineManager } from '@/components/admin/PipelineManager';

export const metadata = {
  title: 'Manage Pipelines | JobTrack Admin',
  description: 'Configure and customize hiring pipelines and their stages.',
};

export default function AdminPipelinesPage() {
  return <PipelineManager />;
}
