'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import { authService } from '../../services/authService';
import { Sparkles, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const showToast = useUiStore((state) => state.showToast);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await authService.login({ email, password });
      login(res.user, res.token);
      showToast(`Welcome back, ${res.user.name}!`, 'success');
      router.replace('/dashboard');
    } catch (err: any) {
      showToast(err.message || 'Invalid email or password', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4 py-12 relative overflow-hidden">
      {/* Premium floating glassmorphism blobs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#E8521A]/8 rounded-full blur-3xl -z-10 animate-pulse duration-[6000ms]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/8 rounded-full blur-3xl -z-10 animate-pulse duration-[8000ms]" />

      <div className="w-full max-w-md glass-panel rounded-3xl shadow-2xl p-8 space-y-8 border border-white/50 animate-scale-in">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#E8521A] to-[#F97316] rounded-2xl shadow-md text-white font-black text-xl mb-2 hover:rotate-6 transition-transform duration-300">
            V
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight flex items-center justify-center gap-2">
            Sign In to VedaAI
          </h1>
          <p className="text-xs text-neutral-400 font-medium">
            Generate assessments and papers in real-time
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-600 pl-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teacher@school.edu"
              disabled={loading}
              className="w-full px-5 py-3 rounded-full text-sm outline-none glass-input"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-600 pl-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="w-full px-5 py-3 rounded-full text-sm outline-none glass-input pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#E8521A] p-1 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 bg-gradient-to-r from-[#E8521A] to-[#F97316] hover:from-[#d14412] hover:to-[#ea580c] text-white text-sm font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Continue</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2">
          <p className="text-xs text-neutral-500 font-medium">
            Don't have an account?{' '}
            <Link
              href="/signup"
              className="text-[#E8521A] font-bold hover:underline transition-all"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
