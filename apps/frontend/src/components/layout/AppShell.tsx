'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ArrowLeft, Bell, Search, ChevronDown, Sparkles } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { MobileHeader } from './MobileHeader';
import { BottomNav } from './BottomNav';
import { Toast } from '../ui/Toast';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useAuthStore } from '../../store/authStore';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const [mounted, setMounted] = useState(false);

  useWebSocket();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const isAuthPage = pathname === '/login' || pathname === '/signup';

    if (!isAuthenticated && !isAuthPage) {
      router.replace('/login');
    } else if (isAuthenticated && isAuthPage) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, pathname, router, mounted]);

  const handleBack = () => {
    if (pathname !== '/dashboard') {
      router.back();
    }
  };

  const handleCreateNew = () => {
    router.push('/assignments/new');
  };

  // Hydration safety: render a beautiful full-screen loading state before store mount
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#E8E8E8] flex items-center justify-center">
        <span className="w-8 h-8 border-3 border-[#E8521A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isAuthPage = pathname === '/login' || pathname === '/signup';

  // If unauthenticated and on an internal page, or authenticated and on an auth page,
  // hold the render while Next.js routes trigger the redirect.
  const isRedirecting = (!isAuthenticated && !isAuthPage) || (isAuthenticated && isAuthPage);

  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-[#E8E8E8] flex items-center justify-center">
        <span className="w-8 h-8 border-3 border-[#E8521A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Full-screen auth views completely isolated from the dashboard shell layout
  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-[#E8E8E8]">
        {children}
        <Toast />
      </div>
    );
  }

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'GT';

  return (
    <div className="min-h-screen bg-neutral-200 text-neutral-900 flex flex-col font-sans">
      <div className="hidden md:flex gap-3 p-3 flex-1 min-h-screen">
        <Sidebar />

        <div className="flex-1 flex flex-col rounded-2xl overflow-hidden bg-white shadow-sm border border-neutral-100 h-[calc(100vh-24px)] sticky top-3">
          <header className="h-14 bg-white border-b border-neutral-100 flex items-center justify-between px-6 z-30">
            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={handleBack}
                disabled={pathname === '/dashboard'}
                className="p-2 hover:bg-neutral-50 rounded-full text-neutral-600 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              {pathname.includes('/result') ? (
                <button
                  onClick={handleCreateNew}
                  className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-full text-xs font-semibold hover:bg-neutral-50 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-neutral-600" />
                  Create New
                </button>
              ) : (
                <div
                  className={`flex items-center gap-2 border rounded-full px-4 py-2 bg-neutral-50 w-80 transition-all ${
                     searchFocused ? 'border-emerald-500 ring-2 ring-emerald-100 bg-white' : 'border-neutral-200'
                  }`}
                >
                  <Search className="w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search Assignment"
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    className="bg-transparent border-none text-xs outline-none flex-1 text-neutral-800 placeholder-neutral-400"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-5">
              <div className="relative p-1.5 hover:bg-neutral-50 rounded-full cursor-pointer transition-colors">
                <Bell className="w-5 h-5 text-neutral-600" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-orange ring-2 ring-white animate-pulse" />
              </div>

              <div className="flex items-center gap-2 border-l border-neutral-100 pl-5 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-orange to-red-500 text-white font-bold text-xs flex items-center justify-center shadow-inner">
                  {userInitials}
                </div>
                <span className="text-sm font-medium text-neutral-800">{user?.name || 'Guest Teacher'}</span>
                <ChevronDown className="w-4 h-4 text-neutral-400" />
              </div>
            </div>
          </header>

          <main className="flex-1 bg-neutral-200 overflow-y-auto min-h-0 relative">
            {children}
          </main>
        </div>
      </div>

      <div className="flex flex-col md:hidden min-h-screen">
        <MobileHeader onToggleSidebar={() => setMobileMenuOpen(!mobileMenuOpen)} />

        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black/40 z-50 transition-all" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-64 h-full bg-white animate-in slide-in-from-left duration-200" onClick={(e) => e.stopPropagation()}>
              <Sidebar />
            </div>
          </div>
        )}

        <main className="flex-1 bg-neutral-200 pb-20 overflow-y-auto">
          {children}
        </main>

        <BottomNav />
      </div>

      <Toast />
    </div>
  );
}
