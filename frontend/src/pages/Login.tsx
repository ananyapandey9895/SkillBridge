import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { error?: string } } }).response?.data?.error ?? 'Invalid credentials'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-foreground text-background flex-col justify-between p-12">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 bg-background rounded-sm flex items-center justify-center text-foreground text-[10px] font-bold">
            SB
          </div>
          <span className="font-semibold text-sm tracking-tight">SkillBridge</span>
        </div>
        <div>
          <blockquote className="text-2xl font-medium leading-snug tracking-tight mb-4">
            "The best way to learn something new is to exchange what you already know."
          </blockquote>
          <p className="text-sm text-background/60">Exchange skills. Build connections. Grow together.</p>
        </div>
        <p className="text-xs text-background/40">© {new Date().getFullYear()} SkillBridge</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="h-7 w-7 bg-foreground rounded-sm flex items-center justify-center text-background text-[10px] font-bold">
              SB
            </div>
            <span className="font-semibold text-sm tracking-tight">SkillBridge</span>
          </div>

          <h1 className="page-title mb-1">Welcome back</h1>
          <p className="text-sm text-muted-foreground mb-8">Sign in to your account</p>

          {error && (
            <div className="mb-5 rounded-md border border-border bg-muted px-4 py-3">
              <p className="text-sm text-foreground">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoFocus
                className="h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="h-10"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                  Signing in…
                </span>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            No account?{' '}
            <Link to="/register" className="text-foreground font-medium underline underline-offset-4 hover:opacity-70 transition-opacity">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
