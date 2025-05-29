import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Briefcase, Users, CalendarPlus } from "lucide-react";

export const metadata = {
  title: 'Admin Dashboard | JobTrack',
  description: 'Manage your recruitment activities.',
};

export default function AdminDashboardPage() {
  // In a real app, fetch and display stats like:
  // - Total open positions
  // - New applications this week
  // - Upcoming interviews

  const stats = [
    { title: "Open Positions", value: "5", icon: Briefcase, link: "/admin/jobs", cta: "Manage Jobs" },
    { title: "Total Applicants", value: "120", icon: Users, link: "/admin/jobs", cta: "View Applicants" }, // Link to jobs, then filter
    { title: "Upcoming Deadlines", value: "3", icon: CalendarPlus, link: "/admin/calendar", cta: "View Calendar" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-primary">Admin Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground pt-1">
                {/* Additional context if needed */}
              </p>
              <Button variant="outline" size="sm" className="mt-4" asChild>
                <Link href={stat.link}>{stat.cta}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Perform common tasks quickly.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button asChild>
            <Link href="/admin/jobs/new">
              <CalendarPlus className="mr-2 h-4 w-4" /> Post New Job
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/admin/pipelines">
               Manage Pipelines
            </Link>
          </Button>
        </CardContent>
      </Card>
      
      {/* Placeholder for more dashboard content like recent activity or charts */}
      <Card className="shadow-sm">
        <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Overview of recent applications and job updates.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">Recent activity feed will be displayed here.</p>
            {/* Example: List of recent applications or job postings */}
        </CardContent>
      </Card>
    </div>
  );
}
