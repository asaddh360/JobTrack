"use client";

import { useState, useEffect } from 'react';
import type { Job } from '@/types';
import { getJobs } from '@/lib/mock-data'; // Assuming a function to get all jobs
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Briefcase, CalendarClock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO string
  type: 'deadline' | 'interview' | 'task'; // Example types
  relatedLink?: string;
  description?: string;
}

export function AdminCalendarView() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCalendarData() {
      setLoading(true);
      const allJobs = await getJobs();
      
      // Transform job deadlines into calendar events
      const deadlineEvents: CalendarEvent[] = allJobs
        .filter(job => new Date(job.deadline) >= new Date()) // Only future or today's deadlines
        .map(job => ({
          id: `deadline-${job.id}`,
          title: `${job.title} - Application Deadline`,
          date: job.deadline,
          type: 'deadline',
          relatedLink: `/admin/jobs/${job.id}`,
          description: `Deadline for job: ${job.title} at ${job.location}.`
      }));

      // TODO: Fetch other event types like interviews when that data exists.
      // For now, just deadlines.

      const sortedEvents = deadlineEvents.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setEvents(sortedEvents);
      setLoading(false);
    }
    fetchCalendarData();
  }, []);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary flex items-center">
          <CalendarDays className="h-6 w-6 mr-2" />
          Admin Activity Calendar
        </CardTitle>
        <CardDescription>Overview of important dates and deadlines across all jobs.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading calendar events...</p>
        ) : events.length === 0 ? (
          <p className="text-muted-foreground">No upcoming events or deadlines.</p>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            <ul className="space-y-4">
              {events.map(event => (
                <li key={event.id} className="p-4 border rounded-lg bg-background hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg flex items-center">
                        {event.type === 'deadline' && <CalendarClock className="h-5 w-5 mr-2 text-destructive" />}
                        {/* Add other icons for other event types */}
                        {event.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                         {' at '} 
                        {new Date(event.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {event.description && <p className="text-xs text-muted-foreground mt-1">{event.description}</p>}
                    </div>
                    {event.relatedLink && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={event.relatedLink}>View Details</Link>
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
