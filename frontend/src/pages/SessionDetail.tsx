import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ChevronLeft, CalendarClock, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { sessionService } from '@/services/sessionService';
import { Session, SessionStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import AnimatedPage from '@/components/shared/AnimatedPage';
import StatusBadge from '@/components/shared/StatusBadge';
import { LoadingSpinner } from '@/components/shared/LoadingState';

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const SessionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [progressPct, setProgressPct] = useState(50);
  const [remarks, setRemarks] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const load = () => {
    sessionService
      .getById(id!)
      .then(setSession)
      .catch(() => undefined)
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  if (loading) return <LoadingSpinner />;
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-sm text-muted-foreground">Session not found.</p>
        <Link
          to="/sessions"
          className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'mt-3')}
        >
          Back to sessions
        </Link>
      </div>
    );
  }

  const isParticipant =
    session.request?.requesterId === user?.id || session.request?.providerId === user?.id;
  const isLearner = session.request?.requesterId === user?.id;

  const handleAction = async (fn: () => Promise<Session>) => {
    setActionLoading(true);
    try {
      const updated = await fn();
      setSession(updated);
      toast.success('Session updated.');
    } catch (err: unknown) {
      toast.error(
        (err as { response?: { data?: { error?: string } } }).response?.data?.error ?? 'Action failed'
      );
    } finally {
      setActionLoading(false);
    }
  };

  const submitProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sessionService.addProgress(session.id, progressPct, remarks);
      toast.success('Progress saved.');
      setRemarks('');
      load();
    } catch (err: unknown) {
      toast.error(
        (err as { response?: { data?: { error?: string } } }).response?.data?.error ?? 'Failed to save progress'
      );
    }
  };

  const submitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sessionService.addFeedback(session.id, rating, comment);
      toast.success('Feedback submitted. Thank you!');
      setComment('');
      load();
    } catch (err: unknown) {
      toast.error(
        (err as { response?: { data?: { error?: string } } }).response?.data?.error ?? 'Failed to submit feedback'
      );
    }
  };

  const latestProgress = session.progressRecords?.[session.progressRecords.length - 1];

  return (
    <AnimatedPage>
      {/* Back nav */}
      <Link
        to="/sessions"
        className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'mb-6 -ml-2 gap-1.5 text-muted-foreground')}
      >
        <ChevronLeft className="h-4 w-4" />
        All sessions
      </Link>

      {/* Page title */}
      <div className="flex items-center gap-3 mb-8">
        <h1 className="page-title truncate">
          {session.request?.skill?.skillName ?? 'Session'}
        </h1>
        <StatusBadge status={session.status} />
      </div>

      <div className="space-y-4">
        {/* Session Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0, duration: 0.22, ease: 'easeOut' }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Session Info</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <CalendarClock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="section-label text-muted-foreground mb-0.5">Scheduled</p>
                    <p className="text-sm font-medium">{formatDate(session.scheduledTime)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="section-label text-muted-foreground mb-0.5">Participants</p>
                    <p className="text-sm font-medium">
                      {session.request?.provider?.name}{' '}
                      <span className="text-muted-foreground font-normal">(mentor)</span>
                    </p>
                    <p className="text-sm font-medium">
                      {session.request?.requester?.name}{' '}
                      <span className="text-muted-foreground font-normal">(learner)</span>
                    </p>
                  </div>
                </div>
              </div>

              {latestProgress && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="section-label text-muted-foreground">Overall Progress</p>
                    <span className="text-sm font-semibold">{latestProgress.percentage}%</span>
                  </div>
                  <Progress value={latestProgress.percentage} className="h-1.5" />
                </div>
              )}

              {isParticipant && (
                <div className="flex gap-2 pt-1">
                  {session.status === SessionStatus.SCHEDULED && (
                    <Button
                      size="sm"
                      onClick={() => void handleAction(() => sessionService.start(session.id))}
                      disabled={actionLoading}
                      className="h-8"
                    >
                      Start session
                    </Button>
                  )}
                  {session.status === SessionStatus.ACTIVE && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => void handleAction(() => sessionService.complete(session.id))}
                      disabled={actionLoading}
                      className="h-8"
                    >
                      Complete session
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Progress Logging */}
        {isLearner && session.status !== SessionStatus.SCHEDULED && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.22, ease: 'easeOut' }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Log Progress</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="pt-5">
                <form onSubmit={submitProgress} className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Completion</Label>
                      <span className="text-sm font-semibold tabular-nums">{progressPct}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={progressPct}
                      onChange={(e) => setProgressPct(Number(e.target.value))}
                      className="w-full h-1.5 accent-foreground cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0%</span>
                      <span>100%</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="remarks" className="text-sm">Remarks</Label>
                    <Input
                      id="remarks"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="What did you learn today?"
                      className="h-10"
                    />
                  </div>
                  <Button type="submit" size="sm" className="h-8">
                    Save progress
                  </Button>
                </form>

                {session.progressRecords && session.progressRecords.length > 0 && (
                  <div className="mt-6">
                    <p className="section-label text-muted-foreground mb-3">Progress History</p>
                    <div className="space-y-2">
                      {session.progressRecords.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-start gap-3 rounded-md bg-muted/50 px-3 py-2.5"
                        >
                          <span className="text-sm font-semibold tabular-nums shrink-0 w-10">
                            {p.percentage}%
                          </span>
                          <span className="text-sm text-muted-foreground">{p.remarks}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Feedback */}
        {isParticipant && session.status === SessionStatus.COMPLETED && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.22, ease: 'easeOut' }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Leave Feedback</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="pt-5">
                <form onSubmit={submitFeedback} className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Rating</Label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`text-lg leading-none transition-opacity ${
                              star <= rating ? 'opacity-100' : 'opacity-20'
                            }`}
                            aria-label={`Rate ${star} out of 5`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="comment" className="text-sm">Comment</Label>
                    <Textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your experience…"
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                  <Button type="submit" size="sm" className="h-8">
                    Submit feedback
                  </Button>
                </form>

                {session.feedbacks && session.feedbacks.length > 0 && (
                  <div className="mt-6">
                    <p className="section-label text-muted-foreground mb-3">Feedback</p>
                    <div className="space-y-2">
                      {session.feedbacks.map((f) => (
                        <div key={f.id} className="rounded-md bg-muted/50 px-3 py-2.5">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-sm">
                              {'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}
                            </span>
                            <span className="text-xs text-muted-foreground">{f.rating}/5</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{f.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </AnimatedPage>
  );
};

export default SessionDetail;
