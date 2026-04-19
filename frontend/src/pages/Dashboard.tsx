import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, ArrowLeftRight, CalendarClock, Star } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { requestService } from '@/services/requestService';
import { sessionService } from '@/services/sessionService';
import { skillService } from '@/services/skillService';
import { RequestStatus, Session, SessionStatus, Skill, SkillRequest, UserRole } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import StatusBadge from '@/components/shared/StatusBadge';
import AnimatedPage from '@/components/shared/AnimatedPage';
import EmptyState from '@/components/shared/EmptyState';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [requests, setRequests] = useState<SkillRequest[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      skillService.getMySkills().catch(() => [] as Skill[]),
      requestService.getSent().catch(() => [] as SkillRequest[]),
      sessionService.getMySessions().catch(() => [] as Session[]),
    ]).then(([s, r, se]) => {
      setSkills(s);
      setRequests(r);
      setSessions(se);
      setLoading(false);
    });
  }, []);

  const pendingRequests = requests.filter((r) => r.status === RequestStatus.PENDING);
  const activeSessions = sessions.filter(
    (s) => s.status === SessionStatus.ACTIVE || s.status === SessionStatus.SCHEDULED
  );

  const stats = [
    { label: 'My Skills', value: skills.length, icon: BookOpen, href: '/skills' },
    { label: 'Pending Requests', value: pendingRequests.length, icon: ArrowLeftRight, href: '/requests' },
    { label: 'Active Sessions', value: activeSessions.length, icon: CalendarClock, href: '/sessions' },
    ...(user?.role === UserRole.MENTOR
      ? [{ label: 'Rating', value: user.rating?.toFixed(1) ?? '—', icon: Star, href: '/sessions' }]
      : []),
  ];

  return (
    <AnimatedPage>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="page-title">{user?.name}</h1>
          <Badge variant="secondary" className="section-label capitalize">
            {user?.role}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">Here's what's happening with your account.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-5">
                <Skeleton className="h-8 w-12 mb-2" />
                <Skeleton className="h-3 w-20" />
              </Card>
            ))
          : stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.22, ease: 'easeOut' }}
              >
                <Link to={stat.href} className="block group">
                  <Card className="p-5 transition-shadow duration-150 hover:shadow-sm border-border">
                    <div className="flex items-start justify-between mb-3">
                      <stat.icon className="h-4 w-4 text-muted-foreground" />
                      <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="stat-value mb-1">{stat.value}</div>
                    <p className="section-label text-muted-foreground">{stat.label}</p>
                  </Card>
                </Link>
              </motion.div>
            ))}
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Skills */}
        <Card>
          <CardHeader className="pb-3 flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Recent Skills</CardTitle>
            <Link
              to="/skills"
              className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'h-7 px-2 text-xs text-muted-foreground gap-1')}
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <Separator />
          <CardContent className="pt-0">
            {loading ? (
              <div className="space-y-3 pt-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between py-1">
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            ) : skills.length === 0 ? (
              <EmptyState
                title="No skills yet"
                description="Add your first skill to get started."
                action={
                  <Link to="/skills" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
                    Add a skill
                  </Link>
                }
              />
            ) : (
              <ul className="divide-y divide-border">
                {skills.slice(0, 4).map((s) => (
                  <li key={s.id} className="flex items-center justify-between py-3 gap-3">
                    <span className="text-sm font-medium truncate">{s.skillName}</span>
                    <Badge variant="outline" className="section-label shrink-0 capitalize">
                      {s.level}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Recent Sessions */}
        <Card>
          <CardHeader className="pb-3 flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Recent Sessions</CardTitle>
            <Link
              to="/sessions"
              className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'h-7 px-2 text-xs text-muted-foreground gap-1')}
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <Separator />
          <CardContent className="pt-0">
            {loading ? (
              <div className="space-y-3 pt-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between py-1">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                ))}
              </div>
            ) : sessions.length === 0 ? (
              <EmptyState
                title="No sessions yet"
                description="Accept a skill request to schedule a session."
              />
            ) : (
              <ul className="divide-y divide-border">
                {sessions.slice(0, 4).map((s) => (
                  <li key={s.id} className="flex items-center justify-between py-3 gap-3">
                    <Link
                      to={`/sessions/${s.id}`}
                      className="text-sm font-medium truncate hover:underline underline-offset-4"
                    >
                      {s.request?.skill?.skillName ?? 'Session'}
                    </Link>
                    <StatusBadge status={s.status} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </AnimatedPage>
  );
};

export default Dashboard;
