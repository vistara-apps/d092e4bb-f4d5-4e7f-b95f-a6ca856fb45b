'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, History, Settings, Home, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: ReactNode;
  variant?: 'default' | 'blur';
  className?: string;
}

export function AppShell({ children, variant = 'default', className }: AppShellProps) {
  return (
    <div className={cn(
      'min-h-screen bg-background',
      variant === 'blur' && 'backdrop-blur-sm',
      className
    )}>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <div className="mr-6 flex items-center space-x-2">
              <AlertTriangle className="h-6 w-6 text-accent" />
              <span className="hidden font-bold text-xl sm:inline-block">
                FloodAlert NG
              </span>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <NavItem href="/" icon={<Home className="h-4 w-4" />} label="Home" />
              <NavItem href="/alerts" icon={<AlertTriangle className="h-4 w-4" />} label="Alerts" />
              <NavItem href="/history" icon={<History className="h-4 w-4" />} label="History" />
              <NavItem href="/settings" icon={<Settings className="h-4 w-4" />} label="Settings" />
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="container py-6"
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © 2024 FloodAlert NG. Hyperlocal flood alerts, before they happen.
          </p>
          <div className="flex items-center space-x-4">
            <span className="text-xs text-muted-foreground">
              Powered by Base
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface NavItemProps {
  href: string;
  icon: ReactNode;
  label: string;
}

function NavItem({ href, icon, label }: NavItemProps) {
  return (
    <a
      href={href}
      className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}

