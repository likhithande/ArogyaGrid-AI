import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import {
  ShieldCheck, Lock, Mail, KeyRound, CheckCircle2,
  AlertCircle, ArrowRight, X, Shield, Activity
} from 'lucide-react';
import { Role } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (role: Role) => void;
  currentRole: Role;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentRole
}) => {
  const [email, setEmail] = useState('admin.national@arogyagrid.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<Role>(currentRole);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);

  if (!isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningIn(true);
    setTimeout(() => {
      setIsSigningIn(false);
      onSuccess(selectedRole);
      onClose();
    }, 600);
  };

  const roles: Role[] = [
    'National Health Administrator',
    'State Health Administrator',
    'District Health Officer',
    'Supply Chain Manager',
    'Emergency Response Coordinator',
    'Data/AI Analyst'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-800 bg-[#0B1220] shadow-2xl flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT COLUMN: Animated Healthcare Network Visualization */}
        <div className="w-full md:w-1/2 p-8 bg-gradient-to-br from-[#070B14] via-[#0B1220] to-[#0A1A2F] border-b md:border-b-0 md:border-r border-slate-800 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Network Canvas simulation */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#06B6D4" strokeWidth="0.5" strokeOpacity="0.4" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              {/* Connecting animated routes */}
              <path d="M 40 100 Q 180 60 260 180 T 400 320" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="6 4" className="animate-pulse" />
              <path d="M 80 340 Q 200 240 320 120" fill="none" stroke="#06B6D4" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="260" cy="180" r="6" fill="#38BDF8" />
              <circle cx="80" cy="340" r="4" fill="#10B981" />
              <circle cx="320" cy="120" r="5" fill="#38BDF8" />
            </svg>
          </div>

          <div className="relative z-10 space-y-4">
            <BrandLogo size="lg" showTagline={true} />
            <div className="pt-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-semibold px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/60">
                FEDERATED ARCHITECTURE
              </span>
              <h2 className="mt-3 text-2xl font-black text-white tracking-tight leading-snug">
                Autonomous Resilience for 1,248 Frontline Nodes
              </h2>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Real-time edge telemetry, continuous demand forecasting, and zero-PII parameter sharing engineered for national public health networks.
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-8 space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <span className="font-semibold text-white block">Zero-Trust Protected</span>
                <span className="text-[10px] text-slate-400">Strict least-privilege RBAC with SHA-256 digital signature gating.</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-800/80">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Network Grid Operational
              </span>
              <span>TLS 1.3 / AES-256</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Enterprise Authentication Panel */}
        <div className="w-full md:w-1/2 p-8 bg-[#0F172A] flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-800 pb-4 mb-6">
              <h3 className="text-xl font-bold text-white tracking-tight">Welcome back</h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter your credentials or choose a pre-configured role to inspect the platform.
              </p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Sign-In Identity / Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as Role)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Official Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="officer@health.gov.in"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <a href="#reset" onClick={(e) => e.preventDefault()} className="text-[11px] text-cyan-400 hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0"
                />
                <label htmlFor="remember" className="text-xs text-slate-400 select-none">
                  Keep session authenticated for 12 hours
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSigningIn}
                className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-900/30 transition-all cursor-pointer"
              >
                {isSigningIn ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>SIGN IN TO COMMAND CENTER</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <span className="text-[11px] text-slate-400">
              Authorized Government & Hospital Personnel Only • NIC / MoHFW Gateway
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
