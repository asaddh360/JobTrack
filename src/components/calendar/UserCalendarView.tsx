"use client";

import { useState, useEffect } from 'react';
import type { Job } from '@/types';
import { getJobs } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarIcon, CalendarClock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';

export function UserCalendarView() {
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDeadlines() {
      setLoading(true);
      const allJobs = await getJobs();
      const openJobs = allJobs.filter(job => job.status === 'Open' && new Date(job.deadline) >= new Date());
      openJobs.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
      setUpcomingDeadlines(openJobs);
      setLoading(false);
    }
    fetchDeadlines();
  }, []);

  return (
    <div className="container py-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary flex items-center">
            <CalendarIcon className="h-6 w-6 mr-2" />
            Application Deadlines
          </CardTitle>
          <CardDescription>Keep track of upcoming job application deadlines.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading deadlines...</p>
          ) : upcomingDeadlines.length === 0 ? (
            <p className="text-muted-foreground">No upcoming deadlines found.</p>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <ul className="space-y-4">
                {upcomingDeadlines.map(job => (
                  <li key={job.id} className="p-4 border rounded-lg bg-background hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">{job.location}</p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/jobs/${job.id}`}>View Job</Link>
                      </Button>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-destructive">
                      <CalendarClock className="h-4 w-4 mr-1" />
                      Deadline: {new Date(job.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
