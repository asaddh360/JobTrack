
import { SignUpForm } from '@/components/auth/SignUpForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/icons/Logo';
import Link from 'next/link';

export const metadata = {
  title: 'Sign Up | JobTrack',
  description: 'Create your JobTrack account.',
};

export default function SignUpPage() {
  return (
    <Card className="shadow-xl">
      <CardHeader className="text-center">
         <Link href="/" className="inline-block mb-4">
            <Logo className="h-8 w-auto mx-auto text-primary" />
        </Link>
        <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
        <CardDescription>Join JobTrack to find your next opportunity.</CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/auth/signin" className="font-medium text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
