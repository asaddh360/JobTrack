import { redirect } from 'next/navigation';

// This page is now effectively /jobs due to the root page.tsx redirect.
// So we redirect again to /jobs to avoid confusion if someone lands on / (which is (user) group root)
export default function UserRootPage() {
  redirect('/jobs');
}
