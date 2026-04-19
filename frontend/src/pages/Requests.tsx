import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { requestService } from '@/services/requestService';
import { RequestStatus, SkillRequest, UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import AnimatedPage from '@/components/shared/AnimatedPage';
import StatusBadge from '@/components/shared/StatusBadge';
import EmptyState from '@/components/shared/EmptyState';
import { LoadingCards } from '@/components/shared/LoadingState';

interface RequestItemProps {
  request: SkillRequest;
  isMentor?: boolean;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  index: number;
}

const RequestItem: React.FC<RequestItemProps> = ({ request: r, isMentor, onAccept, onReject, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05, duration: 0.2, ease: 'easeOut' }}
  >
    <div className="flex items-center justify-between gap-4 py-4 px-1">
      <div className="flex items-center gap-4 min-w-0">
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{r.skill?.skillName}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isMentor ? `from ${r.requester?.name}` : `to ${r.provider?.name}`}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <StatusBadge status={r.status} />
        {isMentor && r.status === RequestStatus.PENDING && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-3"
              onClick={() => onAccept?.(r.id)}
            >
              Accept
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-3 text-muted-foreground"
              onClick={() => onReject?.(r.id)}
            >
              Reject
            </Button>
          </div>
        )}
        {!isMentor && r.status === RequestStatus.ACCEPTED && r.session && (
          <span className="text-xs text-muted-foreground">Session created</span>
        )}
      </div>
    </div>
    <Separator />
  </motion.div>
);

const Requests: React.FC = () => {
  const { user } = useAuth();
  const [sent, setSent] = useState<SkillRequest[]>([]);
  const [received, setReceived] = useState<SkillRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    const fetches: Promise<void>[] = [
      requestService.getSent().then(setSent).catch(() => undefined),
    ];
    if (user?.role === UserRole.MENTOR) {
      fetches.push(requestService.getReceived().then(setReceived).catch(() => undefined));
    }
    Promise.all(fetches).then(() => setLoading(false));
  };

  useEffect(load, [user]);

  const handleAccept = async (id: string) => {
    try {
      await requestService.accept(id);
      toast.success('Request accepted — session scheduled.');
      load();
    } catch (err: unknown) {
      toast.error(
        (err as { response?: { data?: { error?: string } } }).response?.data?.error ?? 'Failed to accept'
      );
    }
  };

  const handleReject = async (id: string) => {
    try {
      await requestService.reject(id);
      toast.success('Request rejected.');
      load();
    } catch (err: unknown) {
      toast.error(
        (err as { response?: { data?: { error?: string } } }).response?.data?.error ?? 'Failed to reject'
      );
    }
  };

  const defaultTab = user?.role === UserRole.MENTOR ? 'received' : 'sent';
  const pendingCount = received.filter((r) => r.status === RequestStatus.PENDING).length;

  return (
    <AnimatedPage>
      <div className="mb-8">
        <h1 className="page-title mb-1">Skill Requests</h1>
        <p className="text-sm text-muted-foreground">Track sent and received skill exchange requests.</p>
      </div>

      <Tabs defaultValue={defaultTab}>
        {user?.role === UserRole.MENTOR && (
          <TabsList className="mb-6 h-9">
            <TabsTrigger value="received" className="text-xs gap-1.5">
              Received
              {pendingCount > 0 && (
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-background text-[10px] font-semibold">
                  {pendingCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="sent" className="text-xs">Sent</TabsTrigger>
          </TabsList>
        )}

        {user?.role === UserRole.MENTOR && (
          <TabsContent value="received">
            {loading ? (
              <LoadingCards count={3} />
            ) : received.length === 0 ? (
              <EmptyState
                title="No requests received"
                description="When learners request your skills, they'll appear here."
              />
            ) : (
              <div>
                <Separator />
                {received.map((r, i) => (
                  <RequestItem
                    key={r.id}
                    request={r}
                    isMentor
                    onAccept={handleAccept}
                    onReject={handleReject}
                    index={i}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        )}

        <TabsContent value="sent">
          {loading ? (
            <LoadingCards count={3} />
          ) : sent.length === 0 ? (
            <EmptyState
              title="No requests sent yet"
              description="Browse skills and send a request to a mentor to get started."
            />
          ) : (
            <div>
              <Separator />
              {sent.map((r, i) => (
                <RequestItem key={r.id} request={r} index={i} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </AnimatedPage>
  );
};

export default Requests;
