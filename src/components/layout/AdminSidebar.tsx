"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Briefcase, Settings, CalendarDays, Users, BarChart3, Bot } from 'lucide-react';
import { Logo } from '@/components/icons/Logo';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

const adminNavItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
  { href: '/admin/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/admin/pipelines', label: 'Pipelines', icon: Settings },
  // { href: '/admin/applicants', label: 'Applicants', icon: Users }, // Maybe combine with jobs
  { href: '/admin/calendar', label: 'Calendar', icon: CalendarDays },
  // { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="p-4 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <Logo className="h-6 w-auto sidebar-logo-text" />
        </Link>
        <SidebarTrigger className="md:hidden" />
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {adminNavItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={{ children: item.label, side: "right", align: "center"}}
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
           <Link href="/jobs">
             <Users className="mr-2 h-4 w-4" /> User View
           </Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
