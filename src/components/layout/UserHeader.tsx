"use client";

import Link from 'next/link';
import { Briefcase, LayoutList, CalendarDays, UserCircle } from 'lucide-react';
import { Logo } from '@/components/icons/Logo';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/applications', label: 'My Applications', icon: LayoutList },
  { href: '/calendar', label: 'Calendar', icon: CalendarDays },
];

export function UserHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/jobs" className="mr-8 flex items-center space-x-2">
          <Logo className="h-6 w-auto text-primary" />
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === item.href ? "text-foreground" : "text-foreground/60"
              )}
            >
              <item.icon className="mr-2 inline-block h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/dashboard">
              <UserCircle className="mr-2 h-4 w-4" /> Admin Panel
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
