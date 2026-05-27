import React from 'react';
import Link from 'next/link';
import { Bell, Menu } from 'lucide-react';

interface MobileHeaderProps {
  onToggleSidebar?: () => void;
}

export function MobileHeader({ onToggleSidebar }: MobileHeaderProps) {
  return (
    <header className="md:hidden h-14 bg-white border-b border-neutral-100 flex items-center justify-between px-4 z-40 sticky top-0">
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="w-7 h-7 bg-gradient-to-br from-brand-orange to-red-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-black text-xs">V</span>
        </div>
        <span className="font-bold text-base text-neutral-900">VedaAI</span>
      </Link>

      <div className="flex items-center gap-3">
        <div className="relative p-1.5 hover:bg-neutral-50 rounded-full cursor-pointer transition-colors">
          <Bell className="w-5 h-5 text-neutral-600" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-orange ring-2 ring-white" />
        </div>
        <div className="w-8 h-8 rounded-full bg-neutral-200 border border-neutral-300 flex items-center justify-center text-xs font-semibold text-neutral-700">
          JD
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
