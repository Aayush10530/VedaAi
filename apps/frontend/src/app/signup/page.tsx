'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import { authService } from '../../services/authService';
import { Sparkles, Eye, EyeOff } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const showToast = useUiStore((state) => state.showToast);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [schoolName, setSchoolName] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !schoolName) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await authService.signUp({ name, email, password, schoolName });
      login(res.user, res.token);
      showToast(`Welcome to VedaAI, ${res.user.name}!`, 'success');
      router.replace('/dashboard');
    } catch (err: any) {
      showToast(err.message || 'Failed to create account', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E8E8E8] px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-neutral-100 p-8 space-y-8 transition-all">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#E8521A] to-[#F97316] rounded-2xl shadow-md text-white font-black text-xl mb-2">
            V
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight flex items-center justify-center gap-2">
            Create Your Account
          </h1>
          <p className="text-xs text-neutral-400">
            Join VedaAI to create curriculum-aligned assessments
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-600 pl-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dr. Sarah Jenkins"
              disabled={loading}
              className="w-full px-5 py-2.5 rounded-full border border-neutral-200 focus:outline-none focus:border-[#E8521A] focus:ring-2 focus:ring-orange-100 bg-neutral-50 text-sm transition-all"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-600 pl-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sarah.jenkins@school.edu"
              disabled={loading}
              className="w-full px-5 py-2.5 rounded-full border border-neutral-200 focus:outline-none focus:border-[#E8521A] focus:ring-2 focus:ring-orange-100 bg-neutral-50 text-sm transition-all"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-600 pl-2">
              School Name
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="Oakwood International Academy"
              disabled={loading}
              className="w-full px-5 py-2.5 rounded-full border border-neutral-200 focus:outline-none focus:border-[#E8521A] focus:ring-2 focus:ring-orange-100 bg-neutral-50 text-sm transition-all"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-600 pl-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                disabled={loading}
                className="w-full px-5 py-2.5 rounded-full border border-neutral-200 focus:outline-none focus:border-[#E8521A] focus:ring-2 focus:ring-orange-100 bg-neutral-50 text-sm transition-all pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-4 bg-gradient-to-r from-[#E8521A] to-[#F97316] hover:from-[#d14412] hover:to-[#ea580c] text-white text-sm font-semibold rounded-full shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Register</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2">
          <p className="text-xs text-neutral-500">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-[#E8521A] font-semibold hover:underline transition-all"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
