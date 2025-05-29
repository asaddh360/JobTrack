
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Loader2, Save } from "lucide-react";

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."), // Email typically not editable or requires verification
  phone: z.string().optional(),
  resumeText: z.string().optional(),
  coverLetter: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface UserProfileFormProps {
  user: User;
}

export function UserProfileForm({ user }: UserProfileFormProps) {
  const { toast } = useToast();
  const { updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "", // Display but typically not editable here
      phone: user.phone || "",
      resumeText: user.resumeText || "",
      coverLetter: user.coverLetter || "",
    },
  });

  async function onSubmit(values: ProfileFormValues) {
    setIsLoading(true);
    // Note: Email is part of the form but we're not allowing its update here for simplicity.
    // A real app would handle email changes with verification.
    const { email, ...updateData } = values; 
    const updatedUser = await updateProfile(user.id, updateData);
    setIsLoading(false);

    if (updatedUser) {
      toast({
        title: "Profile Updated!",
        description: "Your profile information has been saved.",
      });
    } else {
      toast({
        title: "Update Failed",
        description: "Could not update your profile. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} readOnly className="bg-muted/50 cursor-not-allowed"/>
              </FormControl>
              <FormMessage />
              <p className="text-xs text-muted-foreground">Email address cannot be changed here.</p>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number (Optional)</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="123-456-7890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="resumeText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Resume Content (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Paste the full text of your resume here to pre-fill applications..."
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="coverLetter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Cover Letter (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Your generic cover letter template..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </form>
    </Form>
  );
}
