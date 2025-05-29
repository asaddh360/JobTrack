import { UserCalendarView } from '@/components/calendar/UserCalendarView';

export const metadata = {
  title: 'My Calendar | JobTrack',
  description: 'View your application deadlines and important dates.',
};

export default function UserCalendarPage() {
  return <UserCalendarView />;
}
