"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Job, Pipeline } from "@/types";
import { Calendar as CalendarIcon, PlusCircle, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { getPipelines } from "@/lib/mock-data";

const jobPostingFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  location: z.string().min(2, "Location is required."),
  description: z.string().min(50, "Description must be at least 50 characters."),
  requirements: z.array(z.object({ value: z.string().min(1, "Requirement cannot be empty.") })).min(1, "At least one requirement is needed."),
  deadline: z.date({ required_error: "Deadline is required." }),
  status: z.enum(["Open", "Closed"]),
  pipelineId: z.string().min(1, "Pipeline is required."),
});

type JobPostingFormValues = z.infer<typeof jobPostingFormSchema>;

interface JobPostingFormProps {
  initialData?: Job;
  onSubmitSuccess: (job: Job) => void;
  isEditing?: boolean;
}

export function JobPostingForm({ initialData, onSubmitSuccess, isEditing = false }: JobPostingFormProps) {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);

  useEffect(() => {
    async function fetchPipelinesData() {
      const fetchedPipelines = await getPipelines();
      setPipelines(fetchedPipelines);
    }
    fetchPipelinesData();
  }, []);

  const form = useForm<JobPostingFormValues>({
    resolver: zodResolver(jobPostingFormSchema),
    defaultValues: initialData ? {
      ...initialData,
      deadline: new Date(initialData.deadline),
      requirements: initialData.requirements.map(req => ({ value: req })),
    } : {
      title: "",
      location: "",
      description: "",
      requirements: [{ value: "" }],
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days from now
      status: "Open",
      pipelineId: pipelines[0]?.id || "",
    },
  });
  
  useEffect(() => {
    if (pipelines.length > 0 && !initialData && !form.getValues("pipelineId")) {
      form.setValue("pipelineId", pipelines[0].id);
    }
     if (initialData) {
        form.reset({
            ...initialData,
            deadline: new Date(initialData.deadline),
            requirements: initialData.requirements.map(req => ({ value: req })),
        });
    }
  }, [pipelines, initialData, form]);


  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "requirements",
  });

  async function onSubmit(values: JobPostingFormValues) {
    const jobData = {
      ...values,
      deadline: values.deadline.toISOString(),
      requirements: values.requirements.map(r => r.value),
    };

    // In a real app, this would be an API call
    const submittedJob: Job = {
      id: initialData?.id || `job-${Date.now()}`, // Keep existing ID if editing
      postedDate: initialData?.postedDate || new Date().toISOString(), // Keep existing postedDate
      ...jobData,
    };
    onSubmitSuccess(submittedJob);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl><Input placeholder="e.g., Senior Software Engineer" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl><Input placeholder="e.g., Remote, New York, NY" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description</FormLabel>
              <FormControl><Textarea placeholder="Detailed description of the role..." {...field} rows={5} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <FormLabel>Requirements</FormLabel>
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`requirements.${index}.value`}
              render={({ field: reqField }) => (
                <FormItem>
                  <div className="flex items-center space-x-2 mt-2">
                    <FormControl><Input placeholder="e.g., Proficiency in JavaScript" {...reqField} /></FormControl>
                    <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} disabled={fields.length <=1}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => append({ value: "" })} className="mt-2">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Requirement
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>Application Deadline</FormLabel>
                <Popover>
                    <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                        )}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) } // Disable past dates
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
            control={form.control}
            name="pipelineId"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Hiring Pipeline</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select a pipeline" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {pipelines.map(pipeline => (
                        <SelectItem key={pipeline.id} value={pipeline.id}>{pipeline.name}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormDescription>Choose the set of stages for this job's applicants.</FormDescription>
                <FormMessage />
                </FormItem>
            )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (isEditing ? "Saving..." : "Posting...") : (isEditing ? "Save Changes" : "Post Job")}
        </Button>
      </form>
    </Form>
  );
}
