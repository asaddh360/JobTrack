
import { SignInForm } from '@/components/auth/SignInForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/icons/Logo';
import Link from 'next/link';

export const metadata = {
  title: 'Sign In | JobTrack',
  description: 'Sign in to your JobTrack account.',
};

export default function SignInPage() {
  return (
    <Card className="shadow-xl">
      <CardHeader className="text-center">
        <Link href="/" className="inline-block mb-4">
            <Logo className="h-8 w-auto mx-auto text-primary" />
        </Link>
        <CardTitle className="text-2xl font-bold">Welcome Back!</CardTitle>
        <CardDescription>Sign in to access your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <SignInForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="font-medium text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
