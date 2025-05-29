
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
import type { Job, User } from "@/types";
import { addApplication } from "@/lib/mock-data";
import { Paperclip, Send, Loader2 } from "lucide-react";
import { useState } from "react";

const applicationFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phone: z.string().optional(),
  resume: z.any().refine(files => files?.length === 1, "Resume is required.").optional(), // For simplicity, make optional if no actual upload
  resumeText: z.string().min(50, "Resume content must be at least 50 characters."),
  coverLetter: z.string().min(20, "Cover letter must be at least 20 characters.").optional(),
});

type ApplicationFormValues = z.infer<typeof applicationFormSchema>;

interface ApplicationFormProps {
  job: Job;
  applicant: User; // Current logged-in user
  onApplicationSuccess: () => void;
}

export function ApplicationForm({ job, applicant, onApplicationSuccess }: ApplicationFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      name: applicant.name || "",
      email: applicant.email || "",
      phone: applicant.phone || "",
      resumeText: applicant.resumeText || "",
      coverLetter: applicant.coverLetter || "",
    },
  });

  async function onSubmit(values: ApplicationFormValues) {
    setIsLoading(true);
    try {
      const applicationData = {
        jobId: job.id,
        applicantName: values.name, // Use form values, as user might update them for this specific application
        applicantEmail: values.email,
      };
      // The `applicantData` for `addApplication` should be the core applicant details
      // that might create or update an `Applicant` record in mock-data.
      // Here, we pass the currently logged-in applicant's base details along with form-specific ones.
      const applicantDetailsForMock = {
        id: applicant.id, // existing ID
        name: values.name, // use form value
        email: values.email, // use form value
        phone: values.phone,
        resumeText: values.resumeText, // This specific resume text for this application
        coverLetter: values.coverLetter,
        password: applicant.password, // existing password
        isAdmin: applicant.isAdmin, // existing admin status
      };
      
      await addApplication(applicationData, applicantDetailsForMock);

      toast({
        title: "Application Submitted!",
        description: `Your application for ${job.title} has been received.`,
        variant: "default",
      });
      form.reset({ // Reset with original applicant data or empty if preferred
        name: applicant.name || "",
        email: applicant.email || "",
        phone: applicant.phone || "",
        resumeText: applicant.resumeText || "",
        coverLetter: applicant.coverLetter || "",
      });
      onApplicationSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 border rounded-lg bg-card shadow-sm">
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
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
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
          name="resume"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resume (Upload)</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type="file" 
                    accept=".pdf,.doc,.docx,.txt" 
                    onChange={(e) => field.onChange(e.target.files)}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  />
                   <Paperclip className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                </div>
              </FormControl>
              <FormMessage />
              <p className="text-xs text-muted-foreground mt-1">For AI screening, please also paste resume content below.</p>
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="resumeText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Paste Resume Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Paste the full text of your resume here for AI screening..."
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
              <FormLabel>Cover Letter (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us why you're a great fit for this role..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading || form.formState.isSubmitting}>
          {isLoading || form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="ml-2 h-4 w-4" />}
          {isLoading || form.formState.isSubmitting ? "Submitting..." : "Apply Now"}
        </Button>
      </form>
    </Form>
  );
}

