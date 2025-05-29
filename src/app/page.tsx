import { redirect } from 'next/navigation';

export default function HomePage() {
  // For now, redirect all users to the job listings page.
  // In a real app, this could be a landing page or redirect based on auth.
  redirect('/jobs');
}
