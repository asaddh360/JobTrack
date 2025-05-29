
import { UserProfileFormWrapper } from '@/components/profile/UserProfileFormWrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
  title: 'My Profile | JobTrack',
  description: 'Manage your JobTrack profile information.',
};

export default function UserProfilePage() {
  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">My Profile</CardTitle>
            <CardDescription>View and update your personal information.</CardDescription>
          </CardHeader>
          <CardContent>
            <UserProfileFormWrapper />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
