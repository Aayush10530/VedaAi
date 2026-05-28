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
    <nav className="md:hidden fixed bottom-3 left-3 right-3 h-14 bg-white/60 backdrop-blur-lg border border-white/40 rounded-2xl flex items-center justify-around px-4 z-40 shadow-lg">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <Link
            key={idx}
            href={item.href}
            className="flex flex-col items-center justify-center gap-1 py-1 text-center flex-1 transition-all active:scale-90"
          >
            <Icon
              className={cn(
                'w-4.5 h-4.5 transition-all duration-300',
                item.active ? 'text-[#E8521A] scale-110' : 'text-neutral-500'
              )}
            />
            <span
              className={cn(
                'text-[9px] font-bold transition-all duration-300 tracking-tight',
                item.active ? 'text-[#E8521A]' : 'text-neutral-400'
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
