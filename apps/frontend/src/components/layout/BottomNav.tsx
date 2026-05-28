'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, FolderHeart, Sparkles } from 'lucide-react';
import { cn } from '../../lib/cn';

export function BottomNav() {
  const pathname = usePathname();

  const isHomeActive = pathname === '/dashboard';
  const isToolkitActive = pathname.includes('/result') || pathname.includes('/new');
  const isAssignmentsActive = pathname.startsWith('/assignments') && !isToolkitActive;
  const isLibraryActive = pathname.startsWith('/library');

  const items = [
    { label: 'Home', icon: Home, href: '/dashboard', active: isHomeActive },
    { label: 'Assignments', icon: FileText, href: '/assignments', active: isAssignmentsActive },
    { label: 'Library', icon: FolderHeart, href: '/library', active: isLibraryActive },
    { label: 'AI Toolkit', icon: Sparkles, href: '/assignments/new', active: isToolkitActive },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-neutral-900 border-t border-neutral-800 flex items-center justify-around px-4 z-40">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <Link
            key={idx}
            href={item.href}
            className="flex flex-col items-center justify-center gap-1.5 py-1 text-center flex-1 transition-all"
          >
            <Icon
              className={cn(
                'w-5 h-5 transition-colors',
                item.active ? 'text-white' : 'text-neutral-500'
              )}
            />
            <span
              className={cn(
                'text-[10px] font-medium transition-colors',
                item.active ? 'text-white font-semibold' : 'text-neutral-500'
              )}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
