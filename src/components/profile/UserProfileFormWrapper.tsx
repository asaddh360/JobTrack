
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { UserProfileForm } from "./UserProfileForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function UserProfileFormWrapper() {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-10 w-24" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Not Authenticated</AlertTitle>
        <AlertDescription>
          You need to be signed in to view your profile.
        </AlertDescription>
      </Alert>
    );
  }

  return <UserProfileForm user={currentUser} />;
}
