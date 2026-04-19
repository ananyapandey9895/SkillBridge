import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarClock } from 'lucide-react';
import { sessionService } from '@/services/sessionService';
import { Session } from '@/types';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import AnimatedPage from '@/components/shared/AnimatedPage';
import StatusBadge from '@/components/shared/StatusBadge';
import EmptyState from '@/components/shared/EmptyState';
import { LoadingCards } from '@/components/shared/LoadingState';

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const Sessions: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sessionService
      .getMySessions()
      .then(setSessions)
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AnimatedPage>
      <div className="mb-8">
        <h1 className="page-title mb-1">My Sessions</h1>
        <p className="text-sm text-muted-foreground">All your mentorship sessions in one place.</p>
      </div>

      {loading ? (
        <LoadingCards count={4} />
      ) : sessions.length === 0 ? (
        <EmptyState
          title="No sessions yet"
          description="Accept a skill request to create your first mentorship session."
          action={
            <Link to="/requests" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
              View requests
            </Link>
          }
        />
      ) : (
        <div className="space-y-2">
          {sessions.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.2, ease: 'easeOut' }}
              whileHover={{ y: -1 }}
            >
              <Card className="hover:shadow-sm transition-shadow duration-150 border-border">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2.5 mb-2">
                        <h3 className="text-sm font-semibold truncate">
                          {s.request?.skill?.skillName ?? 'Session'}
                        </h3>
                        <StatusBadge status={s.status} />
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="truncate">
                          {s.request?.requester?.name} ↔ {s.request?.provider?.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
                        <CalendarClock className="h-3 w-3 shrink-0" />
                        <span>{formatDate(s.scheduledTime)}</span>
                      </div>
                    </div>
                    <Link
                      to={`/sessions/${s.id}`}
                      className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'h-8 gap-1.5 shrink-0')}
                    >
                      Details
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && sessions.length > 0 && (
        <div className="mt-4">
          <Separator />
          <p className="text-xs text-muted-foreground mt-3 text-center">
            {sessions.length} session{sessions.length !== 1 ? 's' : ''} total
          </p>
        </div>
      )}
    </AnimatedPage>
  );
};

export default Sessions;
