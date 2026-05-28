'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Users, FileText, Sparkles, FolderHeart, Settings, LogOut } from 'lucide-react';
import { cn } from '../../lib/cn';
import { useAssignmentStore } from '../../store/assignmentStore';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const assignments = useAssignmentStore((state) => state.assignments);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const showToast = useUiStore((state) => state.showToast);

  const activeCount = assignments.length;

  const isHomeActive = pathname === '/dashboard';
  const isGroupsActive = pathname.startsWith('/groups');
  const isToolkitActive = pathname.includes('/result') || pathname.includes('/new');
  const isAssignmentsActive = pathname.startsWith('/assignments') && !isToolkitActive;
  const isLibraryActive = pathname.startsWith('/library');

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'success');
    router.replace('/login');
  };

  const menuItems = [
    { label: 'Home', icon: Home, href: '/dashboard', active: isHomeActive },
    { label: 'My Groups', icon: Users, href: '/groups', active: isGroupsActive },
    { label: 'Assignments', icon: FileText, href: '/assignments', active: isAssignmentsActive, badge: activeCount },
    { label: "AI Teacher's Toolkit", icon: Sparkles, href: '/assignments/new', active: isToolkitActive },
    { label: 'My Library', icon: FolderHeart, href: '/library', active: isLibraryActive },
  ];

  const schoolInitials = user?.schoolName
    ? user.schoolName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'VA';

  return (
    <aside className="w-64 bg-white rounded-2xl shadow-sm border border-neutral-100 flex flex-col justify-between p-5 h-[calc(100vh-24px)] sticky top-3">
      <div className="space-y-6">
        <Link href="/dashboard" className="flex items-center gap-2 px-2">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-orange to-red-600 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-black text-sm">V</span>
          </div>
          <span className="font-bold text-lg text-neutral-900 tracking-tight">VedaAI</span>
        </Link>

        <button
          onClick={() => router.push('/assignments/new')}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-brand-orange to-brand-dark text-white text-sm font-semibold rounded-full shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-95"
        >
          <span>✦</span>
          Create Assignment
        </button>

        <nav className="space-y-1.5">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                href={item.href}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 transition-all group',
                  item.active && 'bg-neutral-100 text-neutral-950 font-semibold'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn('w-4.5 h-4.5 text-neutral-400 group-hover:text-neutral-700 transition-colors', item.active && 'text-neutral-900')} />
                  <span className="text-sm">{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="bg-brand-orange text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 transition-all"
        >
          <Settings className="w-4.5 h-4.5 text-neutral-400" />
          <span className="text-sm">Settings</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all font-medium text-left outline-none"
        >
          <LogOut className="w-4.5 h-4.5" />
          <span className="text-sm">Log Out</span>
        </button>

        <div className="flex items-center gap-3 border-t border-neutral-100 pt-4">
          <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-xs text-indigo-700 shadow-inner">
            {schoolInitials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-neutral-900 truncate">{user?.schoolName || 'VedaAI Partner'}</p>
            <p className="text-[10px] text-neutral-400 truncate">{user?.name || 'Guest Teacher'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
