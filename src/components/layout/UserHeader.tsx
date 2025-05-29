
"use client";

import Link from 'next/link';
import { Briefcase, LayoutList, CalendarDays, UserCircle, LogIn, LogOut, User } from 'lucide-react';
import { Logo } from '@/components/icons/Logo';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


const navItems = [
  { href: '/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/applications', label: 'My Applications', icon: LayoutList },
  { href: '/calendar', label: 'Calendar', icon: CalendarDays },
];

export function UserHeader() {
  const pathname = usePathname();
  const { currentUser, logout, isLoading } = useAuth();

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
          {isLoading ? (
            <UserCircle className="h-6 w-6 animate-pulse text-muted-foreground" />
          ) : currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <UserCircle className="h-5 w-5" />
                  <span className="sr-only">Open user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{currentUser.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile"><User className="mr-2 h-4 w-4" /> Profile</Link>
                </DropdownMenuItem>
                {currentUser.isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin/dashboard"><UserCircle className="mr-2 h-4 w-4" /> Admin Panel</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/signin">
                <LogIn className="mr-2 h-4 w-4" /> Sign In
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
