'use client';

import React, { useState } from 'react';
import { User, Settings, Shield, BellRing, Sparkles, BookOpen, Clock, Check } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const showToast = useUiStore((state) => state.showToast);

  // Preferences states
  const [autoDownload, setAutoDownload] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [defaultDuration, setDefaultDuration] = useState('45');
  const [defaultDifficulty, setDefaultDifficulty] = useState('moderate');
  const [saving, setSaving] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast('Workspace settings saved successfully!', 'success');
    }, 800);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
        <span className="w-2 h-2 rounded-full bg-indigo-500 absolute" />
        <h1 className="text-lg font-black text-neutral-900 leading-none pl-2.5">Settings</h1>
      </div>
      <p className="text-xs text-neutral-500 -mt-4 pl-4.5 font-semibold">
        Configure your VedaAI teaching workspace preferences, profile details, and security defaults.
      </p>

      <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card rounded-2xl border border-white/50 shadow-md p-6 space-y-6">
            <h3 className="font-bold text-sm text-neutral-950 flex items-center gap-2 pb-3 border-b border-white/30">
              <User className="w-4.5 h-4.5 text-neutral-500" /> Account Profile
            </h3>

            <div className="flex flex-col items-center text-center space-y-2 py-4 animate-scale-in">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-orange to-red-500 text-white font-black text-xl flex items-center justify-center shadow-lg hover:rotate-3 transition-transform duration-300">
                {user?.name
                  ? user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)
                  : 'GT'}
              </div>
              <h4 className="font-bold text-sm text-neutral-800 mt-1 tracking-tight">{user?.name || 'Guest Teacher'}</h4>
              <span className="text-[9px] uppercase font-bold tracking-widest text-indigo-600 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                Authorized Educator
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <span className="font-bold text-neutral-400 uppercase tracking-wider text-[9px] pl-1">Registered Email</span>
                <p className="font-bold text-neutral-850 bg-white/30 px-3 py-2.5 rounded-xl border border-white/30 backdrop-blur-md shadow-inner">
                  {user?.email || 'teacher@school.edu'}
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="font-bold text-neutral-400 uppercase tracking-wider text-[9px] pl-1">Institution School</span>
                <p className="font-bold text-neutral-850 bg-white/30 px-3 py-2.5 rounded-xl border border-white/30 backdrop-blur-md shadow-inner">
                  {user?.schoolName || 'Partner Academy'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Configurations Card */}
        <div className="lg:col-span-2 space-y-6">
          {/* Toolkit Preferences */}
          <div className="glass-card rounded-2xl border border-white/50 shadow-md p-6 space-y-6">
            <h3 className="font-bold text-sm text-neutral-950 flex items-center gap-2 pb-3 border-b border-white/30">
              <Sparkles className="w-4.5 h-4.5 text-neutral-500" /> AI Toolkit Defaults
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1 pl-1">
                  <Clock className="w-3.5 h-3.5 text-neutral-400" /> Default Time Limit (mins)
                </label>
                <select
                  value={defaultDuration}
                  onChange={(e) => setDefaultDuration(e.target.value)}
                  className="w-full h-11 px-4 border border-white/40 rounded-xl text-xs outline-none bg-white/50 backdrop-blur-md focus:border-[#E8521A] focus:ring-4 focus:ring-orange-500/5 text-neutral-800 transition-all duration-300 font-bold"
                >
                  <option value="30">30 Minutes</option>
                  <option value="45">45 Minutes</option>
                  <option value="60">60 Minutes</option>
                  <option value="90">90 Minutes</option>
                  <option value="120">120 Minutes</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1 pl-1">
                  <BookOpen className="w-3.5 h-3.5 text-neutral-400" /> Preferred Difficulty
                </label>
                <select
                  value={defaultDifficulty}
                  onChange={(e) => setDefaultDifficulty(e.target.value)}
                  className="w-full h-11 px-4 border border-white/40 rounded-xl text-xs outline-none bg-white/50 backdrop-blur-md focus:border-[#E8521A] focus:ring-4 focus:ring-orange-500/5 text-neutral-800 transition-all duration-300 font-bold"
                >
                  <option value="easy">Easy (Fundamentals)</option>
                  <option value="moderate">Moderate (Standard Syllabus)</option>
                  <option value="hard">Hard (Conceptual Limits)</option>
                </select>
              </div>
            </div>
          </div>

          {/* System toggles */}
          <div className="glass-card rounded-2xl border border-white/50 shadow-md p-6 space-y-6">
            <h3 className="font-bold text-sm text-neutral-950 flex items-center gap-2 pb-3 border-b border-white/30">
              <BellRing className="w-4.5 h-4.5 text-neutral-500" /> Notifications & Automations
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-white/20">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-neutral-800">Auto-Download PDFs</h4>
                  <p className="text-[10px] text-neutral-450 font-semibold">Instantly download print-ready question papers when AI generation completes.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoDownload(!autoDownload)}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-all duration-300 shadow-sm border border-transparent ${
                    autoDownload ? 'bg-brand-orange border-orange-650' : 'bg-black/10'
                  }`}
                >
                  <span
                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-350 shadow ${
                      autoDownload ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-neutral-800">Email Alerts</h4>
                  <p className="text-[10px] text-neutral-450 font-semibold">Receive scoring reports and completion notifications at your registered email address.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailAlerts(!emailAlerts)}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-all duration-300 shadow-sm border border-transparent ${
                    emailAlerts ? 'bg-brand-orange border-orange-650' : 'bg-black/10'
                  }`}
                >
                  <span
                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-350 shadow ${
                      emailAlerts ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 bg-gradient-to-r from-brand-orange to-red-500 hover:from-orange-600 hover:to-red-650 text-white text-xs font-bold px-6 py-3 rounded-full shadow hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
            >
              {saving ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" /> Save Workspace Settings
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
