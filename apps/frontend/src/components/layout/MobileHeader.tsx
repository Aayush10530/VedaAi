import React from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface MobileHeaderProps {
  onToggleSidebar?: () => void;
}

export function MobileHeader({ onToggleSidebar }: MobileHeaderProps) {
  const user = useAuthStore((state) => state.user);
  
  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'GT';

  return (
    <header className="md:hidden h-14 bg-white/40 backdrop-blur-lg border-b border-white/30 flex items-center justify-between px-4 z-40 sticky top-0 shadow-sm">
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="w-7 h-7 bg-gradient-to-br from-brand-orange to-red-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-black text-xs">V</span>
        </div>
        <span className="font-bold text-base text-neutral-900">VedaAI</span>
      </Link>

      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-orange to-red-500 text-white border border-neutral-100 flex items-center justify-center text-xs font-semibold shadow-inner">
          {userInitials}
        </div>
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-1.5 hover:bg-neutral-50 rounded-full cursor-pointer transition-colors text-neutral-600"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
      </div>
    </header>
  );
}
