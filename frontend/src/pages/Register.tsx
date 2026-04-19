import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: UserRole.LEARNER,
    learningGoals: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role, form.learningGoals || undefined);
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { error?: string } } }).response?.data?.error ?? 'Registration failed'
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
            "Every expert was once a beginner with the courage to ask for help."
          </blockquote>
          <p className="text-sm text-background/60">Join a community of learners and mentors.</p>
        </div>
        <p className="text-xs text-background/40">© {new Date().getFullYear()} SkillBridge</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full max-w-sm py-8"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="h-7 w-7 bg-foreground rounded-sm flex items-center justify-center text-background text-[10px] font-bold">
              SB
            </div>
            <span className="font-semibold text-sm tracking-tight">SkillBridge</span>
          </div>

          <h1 className="page-title mb-1">Create account</h1>
          <p className="text-sm text-muted-foreground mb-8">Join SkillBridge to exchange skills</p>

          {error && (
            <div className="mb-5 rounded-md border border-border bg-muted px-4 py-3">
              <p className="text-sm text-foreground">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm">Full name</Label>
              <Input
                id="name"
                type="text"
                value={form.name}
                onChange={set('name')}
                placeholder="Alex Johnson"
                required
                autoFocus
                className="h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="you@example.com"
                required
                className="h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm">Password</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={set('password')}
                placeholder="••••••••"
                required
                className="h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Role</Label>
              <Select
                value={form.role}
                onValueChange={(val) => setForm((f) => ({ ...f, role: val as UserRole }))}
              >
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.LEARNER}>Learner</SelectItem>
                  <SelectItem value={UserRole.MENTOR}>Mentor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {form.role === UserRole.LEARNER && (
              <div className="space-y-1.5">
                <Label htmlFor="goals" className="text-sm">Learning goals <span className="text-muted-foreground">(optional)</span></Label>
                <Textarea
                  id="goals"
                  value={form.learningGoals}
                  onChange={set('learningGoals')}
                  placeholder="What do you want to learn?"
                  rows={2}
                  className="resize-none"
                />
              </div>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                  Creating account…
                </span>
              ) : (
                'Create account'
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-foreground font-medium underline underline-offset-4 hover:opacity-70 transition-opacity">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
