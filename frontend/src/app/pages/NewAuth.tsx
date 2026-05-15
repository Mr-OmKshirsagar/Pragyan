import { useState, useEffect } from 'react';
import { GlassButton } from '../components/GlassButton';
import { GlassCard } from '../components/GlassCard';
import { GlassInput } from '../components/GlassInput';
import { Icons } from '../components/Icons';
import { apiFetch } from '../../services/api';
import { toast } from 'sonner';

interface NewAuthProps {
  mode: 'login' | 'register';
  onLogin: (email: string) => void;
  onRegister: (name: string, email: string) => void;
  onToggleMode: () => void;
  onBack: () => void;
  onLogoClick?: () => void;
}

export function NewAuth({ mode, onLogin, onRegister, onToggleMode, onBack, onLogoClick }: NewAuthProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load saved email on mount
  useEffect(() => {
    if (mode === 'login') {
      const savedEmail = localStorage.getItem('rememberedEmail');
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    }
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (mode === 'register' && name.trim().length < 2) {
      setSubmitError('Full name must be at least 2 characters');
      return;
    }

    if (password.length < 6) {
      setSubmitError('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);

    if (mode === 'login') {
      try {
        const data = await apiFetch<any>('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });

        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        localStorage.setItem('userEmail', data.data.user.email);
        localStorage.setItem('userRole', data.data.user.role || 'USER');

        // Save email if remember me is checked
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        toast.success(`Welcome back, ${data.data.user.fullName || email.split('@')[0]}!`);
        onLogin(data.data.user.fullName || email);
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Login failed. Check your credentials.';
        setSubmitError(msg);
        toast.error(msg);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      try {
        const data = await apiFetch<any>('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify({ fullName: name, email, password }),
        });

        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        localStorage.setItem('userEmail', data.data.user.email);
        localStorage.setItem('userRole', data.data.user.role || 'USER');

        toast.success('Account created! Welcome to Pragyan 🎉');
        onRegister(data.data.user.fullName || name, email);
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Registration failed. Try again.';
        setSubmitError(msg);
        toast.error(msg);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div
          onClick={onLogoClick}
          className="text-center mb-8 cursor-pointer group"
        >
          <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
            <Icons.Brain />
          </div>
          <h2 className="text-lg font-semibold text-indigo-400 group-hover:text-indigo-300 transition-colors mb-4">
            ✨ Pragyan
          </h2>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Get Started'}
          </h1>
          <p className="text-gray-400">
            {mode === 'login'
              ? 'Sign in to continue your journey'
              : 'Create your account to discover your career path'}
          </p>
        </div>

        <GlassCard strong className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {submitError && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {submitError}
              </div>
            )}

            {mode === 'register' && (
              <GlassInput
                label="Full Name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={<Icons.User />}
                required
              />
            )}
            <GlassInput
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
              required
            />
            <GlassInput
              label="Password"
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
              required
            />

            {mode === 'login' && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember me
                </label>
                <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                  Forgot password?
                </a>
              </div>
            )}

            <GlassButton type="submit" variant="primary" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </GlassButton>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button onClick={onToggleMode} className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </GlassCard>

        {mode === 'register' && (
          <div className="mt-6 glass rounded-xl p-4 text-center">
            <p className="text-sm text-gray-400">
              By creating an account, you agree to our Terms and Privacy Policy
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
