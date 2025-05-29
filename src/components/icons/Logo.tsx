import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 20"
      width="100"
      height="20"
      aria-label="JobTrack Logo"
      {...props}
    >
      <style>
        {`
          .logo-text { font-family: var(--font-geist-sans), Arial, sans-serif; font-size: 16px; font-weight: 600; fill: hsl(var(--primary)); }
          .logo-text-dark { fill: hsl(var(--sidebar-foreground)); }
          .dark .logo-text { fill: hsl(var(--primary)); }
          .dark .logo-text-on-sidebar { fill: hsl(var(--sidebar-foreground)); }

          .sidebar-logo .logo-text { fill: hsl(var(--sidebar-foreground)); }
        `}
      </style>
      <text x="0" y="15" className={`logo-text ${props.className?.includes('sidebar-logo-text') ? 'logo-text-on-sidebar' : ''}`}>
        JobTrack
      </text>
    </svg>
  );
}
