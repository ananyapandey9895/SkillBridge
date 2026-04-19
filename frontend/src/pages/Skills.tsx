import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { requestService } from '@/services/requestService';
import { skillService } from '@/services/skillService';
import { Skill, SkillLevel, UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import AnimatedPage from '@/components/shared/AnimatedPage';
import EmptyState from '@/components/shared/EmptyState';
import { LoadingCards } from '@/components/shared/LoadingState';

const levelConfig: Record<SkillLevel, string> = {
  [SkillLevel.BEGINNER]: 'Beginner',
  [SkillLevel.INTERMEDIATE]: 'Intermediate',
  [SkillLevel.ADVANCED]: 'Advanced',
};

const Skills: React.FC = () => {
  const { user } = useAuth();
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [mySkills, setMySkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ skillName: '', description: '', level: SkillLevel.BEGINNER });
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([
      skillService.getAll().catch(() => [] as Skill[]),
      skillService.getMySkills().catch(() => [] as Skill[]),
    ]).then(([all, my]) => {
      setAllSkills(all);
      setMySkills(my);
      setLoading(false);
    });
  };

  useEffect(load, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await skillService.create(form.skillName, form.description, form.level);
      setForm({ skillName: '', description: '', level: SkillLevel.BEGINNER });
      setDialogOpen(false);
      toast.success('Skill added successfully.');
      load();
    } catch (err: unknown) {
      toast.error(
        (err as { response?: { data?: { error?: string } } }).response?.data?.error ?? 'Failed to add skill'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await skillService.delete(id);
      toast.success('Skill removed.');
      load();
    } catch {
      toast.error('Failed to remove skill.');
    }
  };

  const handleRequest = async (skillId: string) => {
    try {
      await requestService.create(skillId);
      toast.success('Request sent to mentor.');
    } catch (err: unknown) {
      toast.error(
        (err as { response?: { data?: { error?: string } } }).response?.data?.error ?? 'Failed to send request'
      );
    }
  };

  const mySkillIds = new Set(mySkills.map((s) => s.id));

  return (
    <AnimatedPage>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title mb-1">Skills</h1>
          <p className="text-sm text-muted-foreground">Browse and request skills from the community.</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2 h-9">
          <Plus className="h-3.5 w-3.5" />
          Add skill
        </Button>
      </div>

      {/* Add Skill Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add a new skill</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="skillName" className="text-sm">Skill name</Label>
              <Input
                id="skillName"
                value={form.skillName}
                onChange={(e) => setForm({ ...form, skillName: e.target.value })}
                placeholder="e.g. React.js, Guitar, Python"
                required
                autoFocus
                className="h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Level</Label>
              <Select
                value={form.level}
                onValueChange={(val) => setForm({ ...form, level: val as SkillLevel })}
              >
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(SkillLevel).map((l) => (
                    <SelectItem key={l} value={l}>{levelConfig[l]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-sm">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Briefly describe what you offer or need"
                rows={3}
                className="resize-none"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Creating…' : 'Create skill'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Skills grid */}
      {loading ? (
        <LoadingCards count={6} />
      ) : allSkills.length === 0 ? (
        <EmptyState
          title="No skills available yet"
          description="Be the first to add a skill to the community."
          action={
            <Button onClick={() => setDialogOpen(true)} className="gap-2">
              <Plus className="h-3.5 w-3.5" />
              Add your first skill
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {allSkills.map((skill, i) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.2, ease: 'easeOut' }}
              whileHover={{ y: -2 }}
            >
              <Card className="h-full flex flex-col hover:shadow-sm transition-shadow duration-150 border-border">
                <CardContent className="flex flex-col flex-1 p-5 gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold leading-tight">{skill.skillName}</h3>
                    <Badge variant="outline" className="section-label shrink-0 capitalize">
                      {levelConfig[skill.level]}
                    </Badge>
                  </div>
                  {skill.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1">
                      {skill.description}
                    </p>
                  )}
                  <Separator />
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground truncate">by {skill.user?.name}</span>
                    {mySkillIds.has(skill.id) ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => void handleDelete(skill.id)}
                        className="h-7 px-2 text-muted-foreground hover:text-foreground gap-1.5"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </Button>
                    ) : user?.role !== UserRole.ADMIN && skill.userId !== user?.id ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => void handleRequest(skill.id)}
                        className="h-7 px-3"
                      >
                        Request
                      </Button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </AnimatedPage>
  );
};

export default Skills;
