'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'blur';
}

export function AppShell({ children, className, variant = 'default' }: AppShellProps) {
  return (
    <div
      className={cn(
        'min-h-screen bg-background',
        variant === 'blur' && 'backdrop-blur-sm',
        className
      )}
    >
      <div className="container mx-auto max-w-7xl px-6">
        {children}
      </div>
    </div>
  );
}

interface AppShellHeaderProps {
  children: ReactNode;
  className?: string;
}

export function AppShellHeader({ children, className }: AppShellHeaderProps) {
  return (
    <header className={cn('py-6 border-b border-border', className)}>
      {children}
    </header>
  );
}

interface AppShellMainProps {
  children: ReactNode;
  className?: string;
}

export function AppShellMain({ children, className }: AppShellMainProps) {
  return (
    <main className={cn('py-8', className)}>
      {children}
    </main>
  );
}

interface AppShellFooterProps {
  children: ReactNode;
  className?: string;
}

export function AppShellFooter({ children, className }: AppShellFooterProps) {
  return (
    <footer className={cn('py-6 border-t border-border mt-12', className)}>
      {children}
    </footer>
  );
}

