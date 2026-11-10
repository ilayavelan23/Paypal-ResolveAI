import React, { useState } from 'react';
import {
  Bot,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Play,
  Layers,
  Sparkles,
  RotateCcw,
  Scale
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AuthViews: React.FC = () => {
  const { currentTab, navigateTo, setIsAuthenticated, showToast } = useApp();
  const [subView, setSubView] = useState<'landing' | 'signin' | 'signup' | 'forgot' | 'reset-sent'>('landing');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('ilayavelan.mb@email.com');
  const [password, setPassword] = useState('••••••••••');
  const [name, setName] = useState('M.B. Ilayavelan');
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Sync subView if parent sets it
  React.useEffect(() => {
    if (currentTab === 'auth-signin') setSubView('signin');
    if (currentTab === 'auth-signup') setSubView('signup');
    if (currentTab === 'auth-forgot') setSubView('forgot');
    if (currentTab === 'auth-landing') setSubView('landing');
  }, [currentTab]);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
    showToast('Signed in successfully as ' + email);
    navigateTo('dashboard');
  };

  const handleSandboxContinue = () => {
    setIsAuthenticated(true);
    showToast('Authenticated via PayPal Sandbox!');
    navigateTo('dashboard');
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
    showToast('Account created successfully! Welcome to ResolveAI.');
    navigateTo('dashboard');
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubView('reset-sent');
  };

  // 1. LANDING PAGE (matching Top-Left of Image 2)
  if (subView === 'landing') {
    return (
      <div className="min-h-screen bg-[#071426] text-white flex flex-col justify-between selection:bg-blue-600 selection:text-white">
        {/* Landing Nav */}
        <header className="px-6 lg:px-16 py-5 flex items-center justify-between border-b border-[#142642]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#003087] via-[#0070BA] to-[#009cde] flex items-center justify-center font-black italic text-lg shadow-md">
              P<span className="-ml-1 text-sky-200">P</span>
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white">PayPal ResolveAI</span>
              <span className="block text-[10px] text-slate-400">AI-Powered Payment Assistant</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how" className="hover:text-white transition-colors">How it Works</a>
            <a href="#security" className="hover:text-white transition-colors">Security</a>
            <a href="#help" className="hover:text-white transition-colors">Help</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSubView('signin')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-white/5 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => setSubView('signup')}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0070BA] hover:bg-blue-600 text-white shadow-md shadow-blue-500/20 transition-all"
            >
              Get Started
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <main className="px-6 lg:px-16 py-12 lg:py-16 flex-1 flex flex-col justify-center">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/50 border border-blue-500/30 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Agent Autonomous Payment Resolution</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
              Resolve Your PayPal Payments <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                with AI
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              An intelligent multi-agent assistant to analyze transactions, detect risks, guide refunds, and resolve disputes — faster and easier.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setSubView('signin')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-[#0070BA] hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setIsAuthenticated(true);
                  navigateTo('dashboard');
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/15 text-white border border-white/10 flex items-center justify-center gap-2 transition-all"
              >
                <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                <span>Launch Interactive Prototype</span>
              </button>
            </div>

            {/* 4 Feature Badges matching reference */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 max-w-3xl mx-auto text-left">
              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                <Bot className="w-5 h-5 text-cyan-400 mb-2" />
                <h4 className="text-xs font-bold text-white">AI Assistance</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Instant payment help</p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                <ShieldCheck className="w-5 h-5 text-amber-400 mb-2" />
                <h4 className="text-xs font-bold text-white">Fraud Detection</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Spot suspicious activity</p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                <RotateCcw className="w-5 h-5 text-rose-400 mb-2" />
                <h4 className="text-xs font-bold text-white">Refund Guidance</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Track and get refund help</p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                <Scale className="w-5 h-5 text-indigo-400 mb-2" />
                <h4 className="text-xs font-bold text-white">Dispute Support</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Prepare and resolve disputes</p>
              </div>
            </div>
          </div>
        </main>

        <footer className="px-6 py-4 text-center text-xs text-slate-500 border-t border-[#142642]">
          PayPal ResolveAI Prototype • Demo Data & Official Sandbox Architecture
        </footer>
      </div>
    );
  }

  // 2. SIGN IN / SIGN UP / FORGOT PASSWORD Split Screen Modal
  return (
    <div className="min-h-screen bg-[#071426] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-slate-100">
        {/* Left Side: Brand & Visuals */}
        <div className="w-full md:w-5/12 bg-gradient-to-br from-[#061730] via-[#092248] to-[#040e1d] text-white p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-44 h-44 bg-blue-500/20 rounded-full blur-2xl pointer-events-none"></div>

          <div>
            <div className="flex items-center gap-2.5 mb-8">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#003087] to-[#0070BA] flex items-center justify-center font-black italic text-base">
                P
              </div>
              <span className="font-bold text-sm text-white">PayPal ResolveAI</span>
            </div>

            <div className="my-8 text-center sm:text-left">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-cyan-400 p-0.5 shadow-xl mb-4 mx-auto sm:mx-0">
                <div className="w-full h-full bg-[#08182f] rounded-[14px] flex items-center justify-center">
                  <Bot className="w-8 h-8 text-cyan-400" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-white leading-tight">
                {subView === 'signin' && 'Your Intelligent Payment Partner'}
                {subView === 'signup' && 'Create Your ResolveAI Account'}
                {subView === 'forgot' && 'Forgot Your Password?'}
                {subView === 'reset-sent' && 'Check Your Email'}
              </h2>
              <p className="text-xs text-slate-300 mt-2">
                {subView === 'signin' && 'Access your dashboard, transactions, and AI assistant.'}
                {subView === 'signup' && 'Join thousands resolving payments autonomously.'}
                {subView === 'forgot' && "No worries. We'll help you reset it securely."}
                {subView === 'reset-sent' && `We've sent a password reset link to ${email}`}
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-300 border-t border-blue-900/40 pt-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Get instant payment support</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Monitor account activity & risks</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Resolve issues with multi-agent AI</span>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Forms */}
        <div className="w-full md:w-7/12 p-8 sm:p-10 flex flex-col justify-center">
          {/* SubView: SIGN IN */}
          {subView === 'signin' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Sign In to ResolveAI</h3>
                <p className="text-xs text-slate-500 mt-1">Access your dashboard, transactions, and AI assistant</p>
              </div>

              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0070BA]"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0070BA]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-[#0070BA] focus:ring-0"
                    />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setSubView('forgot')}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-[#0070BA] hover:bg-blue-700 text-white shadow-xs transition-colors"
                >
                  Sign In
                </button>
              </form>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <span className="w-full border-t border-slate-200"></span>
                <span className="bg-white px-3 text-[11px] text-slate-400 uppercase font-medium">or continue with</span>
              </div>

              {/* Continue with PayPal Sandbox */}
              <button
                onClick={handleSandboxContinue}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <span className="font-serif font-black italic text-blue-700 text-sm">P</span>
                <span>Continue with PayPal (Sandbox)</span>
              </button>

              <div className="text-center text-xs text-slate-500 pt-2">
                Don't have an account?{' '}
                <button
                  onClick={() => setSubView('signup')}
                  className="font-bold text-[#0070BA] hover:underline"
                >
                  Sign up
                </button>
              </div>
            </div>
          )}

          {/* SubView: SIGN UP */}
          {subView === 'signup' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Create Your Account</h3>
                <p className="text-xs text-slate-500 mt-0.5">Get started with ResolveAI in just a few steps</p>
              </div>

              <form onSubmit={handleSignUp} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#0070BA]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#0070BA]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#0070BA]"
                  />
                </div>

                <label className="flex items-center gap-2 text-[11px] text-slate-600 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    required
                    className="rounded text-[#0070BA]"
                  />
                  <span>I agree to the Terms of Service and Privacy Policy</span>
                </label>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-[#0070BA] hover:bg-blue-700 text-white shadow-xs transition-colors"
                >
                  Create Account
                </button>
              </form>

              <div className="text-center text-xs text-slate-500 pt-2">
                Already have an account?{' '}
                <button
                  onClick={() => setSubView('signin')}
                  className="font-bold text-[#0070BA] hover:underline"
                >
                  Sign in
                </button>
              </div>
            </div>
          )}

          {/* SubView: FORGOT PASSWORD */}
          {subView === 'forgot' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Forgot Password</h3>
                <p className="text-xs text-slate-500 mt-1">Enter your email and we'll send a reset link</p>
              </div>

              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0070BA]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-[#0070BA] hover:bg-blue-700 text-white shadow-xs transition-colors"
                >
                  Send Reset Link
                </button>
              </form>

              <div className="text-center pt-2">
                <button
                  onClick={() => setSubView('signin')}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  ← Back to Sign In
                </button>
              </div>
            </div>
          )}

          {/* SubView: RESET LINK SENT */}
          {subView === 'reset-sent' && (
            <div className="space-y-4 text-center sm:text-left">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Reset Link Sent!</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  A password reset link has been sent to your email. Please check your inbox (and spam folder) and follow the instructions.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSubView('signin')}
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-[#0070BA] hover:bg-blue-700 text-white shadow-xs"
                >
                  Open My Email
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 pt-2 gap-2">
                <span>Didn't receive the email? <button onClick={() => showToast('Reset link resent.')} className="font-semibold text-blue-600 hover:underline">Resend Link</button></span>
                <button onClick={() => setSubView('signin')} className="text-slate-600 hover:underline">
                  ← Back to Sign In
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
