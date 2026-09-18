'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Avatar } from '@/components/shared/StatusBadge';
import { UserPlus, Trash2, Check, X, Shield, Eye, EyeOff, Minus, Users, Crown, Mail, Clock } from 'lucide-react';
import {
  loadTeamMembers,
  inviteTeamMember,
  updateTeamMemberRole,
  removeTeamMember,
  ROLE_LABELS,
  ROLE_DESCRIPTIONS,
  ROLE_PERMISSIONS,
  PERMISSION_AREAS,
  type TeamMember,
  type TeamRole,
  type PermissionLevel,
} from '@/lib/team-persistence';
import { cn } from '@/lib/utils';

const ALL_ROLES: TeamRole[] = ['ADMIN', 'MANAGER', 'EDITOR', 'ANALYST', 'SUPPORT'];

const roleColors: Record<TeamRole, string> = {
  OWNER: '#E1062C',
  ADMIN: '#18191D',
  MANAGER: '#2563EB',
  EDITOR: '#0B9B6B',
  ANALYST: '#F59E0B',
  SUPPORT: '#6B6E76',
};

export default function PartnerTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamRole>('EDITOR');
  const [removeTarget, setRemoveTarget] = useState<TeamMember | null>(null);
  const [showPermissions, setShowPermissions] = useState(false);

  useEffect(() => {
    setMembers(loadTeamMembers());
    setLoaded(true);
  }, []);

  const refresh = () => setMembers(loadTeamMembers());

  const handleInvite = () => {
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    inviteTeamMember(inviteName.trim(), inviteEmail.trim(), inviteRole);
    setInviteOpen(false);
    setInviteName('');
    setInviteEmail('');
    setInviteRole('EDITOR');
    refresh();
  };

  const handleRoleChange = (id: string, role: TeamRole) => {
    updateTeamMemberRole(id, role);
    refresh();
  };

  const handleRemove = (id: string) => {
    removeTeamMember(id);
    setRemoveTarget(null);
    refresh();
  };

  const activeMembers = members.filter((m) => m.status !== 'REMOVED');
  const owner = activeMembers.find((m) => m.role === 'OWNER');

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Team"
        title="Team members"
        description="Invite team members and manage their access. Each role controls what your team can see and do across your storefronts."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="rounded-full border-cv-line font-bold text-sm"
              onClick={() => setShowPermissions((v) => !v)}
            >
              <Shield className="h-4 w-4" />
              {showPermissions ? 'Hide permissions' : 'View permissions'}
            </Button>
            <Button
              className="bg-cv-ink text-white hover:bg-cv-ink/90 rounded-full text-sm font-bold"
              onClick={() => setInviteOpen(true)}
            >
              <UserPlus className="h-4 w-4" />
              Invite member
            </Button>
          </div>
        }
      />

      {/* Members list */}
      {loaded && (
        <Card className="cv-card">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cv-soft">
                <Users className="h-5 w-5 text-cv-ink" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-cv-ink">Team members ({activeMembers.length})</CardTitle>
                <p className="text-xs text-cv-muted mt-0.5">People with access to your partner workspace</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-cv-line">
              {activeMembers.map((m) => (
                <div key={m.id} className="flex items-center gap-4 px-5 py-4">
                  <Avatar name={m.name} color={roleColors[m.role]} size={40} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-cv-ink truncate">{m.name}</p>
                      {m.role === 'OWNER' && <Crown className="h-3.5 w-3.5 text-cv-red shrink-0" />}
                    </div>
                    <p className="text-xs text-cv-muted truncate">{m.email}</p>
                  </div>

                  {/* Status badge */}
                  {m.status === 'PENDING' && (
                    <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-full shrink-0">
                      <Clock className="h-3 w-3" />
                      Pending
                    </span>
                  )}
                  {m.status === 'ACTIVE' && (
                    <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-cv-good bg-emerald-50 px-2 py-1 rounded-full shrink-0">
                      <Check className="h-3 w-3" />
                      Active
                    </span>
                  )}

                  {/* Role selector */}
                  {m.role === 'OWNER' ? (
                    <span className="text-xs font-bold text-cv-red bg-red-50 px-3 py-1.5 rounded-full shrink-0">
                      {ROLE_LABELS[m.role]}
                    </span>
                  ) : (
                    <Select value={m.role} onValueChange={(v) => handleRoleChange(m.id, v as TeamRole)}>
                      <SelectTrigger className="w-[110px] h-8 text-xs font-bold rounded-full border-cv-line shrink-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ALL_ROLES.map((r) => (
                          <SelectItem key={r} value={r} className="text-xs font-bold">
                            {ROLE_LABELS[r]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {/* Remove button */}
                  {m.role !== 'OWNER' && (
                    <Button
                      variant="outline"
                      className="rounded-full border-cv-line text-xs font-bold px-2.5 text-cv-red hover:bg-red-50 shrink-0"
                      onClick={() => setRemoveTarget(m)}
                      title="Remove member"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Permissions matrix */}
      {showPermissions && (
        <Card className="cv-card">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cv-soft">
                <Shield className="h-5 w-5 text-cv-ink" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-cv-ink">Permission matrix</CardTitle>
                <p className="text-xs text-cv-muted mt-0.5">What each role can access across your workspace</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-cv-line">
                  <th className="text-left font-bold text-cv-muted uppercase tracking-wider py-3 px-5 sticky left-0 bg-white">Area</th>
                  {(['OWNER', 'ADMIN', 'MANAGER', 'EDITOR', 'ANALYST', 'SUPPORT'] as TeamRole[]).map((r) => (
                    <th key={r} className="text-center font-bold text-cv-muted uppercase tracking-wider py-3 px-3 min-w-[80px]">
                      {ROLE_LABELS[r]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PERMISSION_AREAS.map((area) => (
                  <tr key={area.key} className="border-b border-cv-line last:border-0">
                    <td className="py-3 px-5 sticky left-0 bg-white">
                      <p className="text-sm font-bold text-cv-ink">{area.label}</p>
                      <p className="text-[10px] text-cv-muted">{area.description}</p>
                    </td>
                    {(['OWNER', 'ADMIN', 'MANAGER', 'EDITOR', 'ANALYST', 'SUPPORT'] as TeamRole[]).map((r) => (
                      <td key={r} className="text-center py-3 px-3">
                        <PermissionIcon level={ROLE_PERMISSIONS[r][area.key]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Role descriptions */}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {(['OWNER', 'ADMIN', 'MANAGER', 'EDITOR', 'ANALYST', 'SUPPORT'] as TeamRole[]).map((r) => (
          <Card key={r} className="cv-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: roleColors[r] }} />
                <p className="text-sm font-bold text-cv-ink">{ROLE_LABELS[r]}</p>
                {r === 'OWNER' && <Crown className="h-3.5 w-3.5 text-cv-red" />}
              </div>
              <p className="text-xs text-cv-muted leading-relaxed">{ROLE_DESCRIPTIONS[r]}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Invite dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-cv-ink">Invite a team member</DialogTitle>
            <DialogDescription className="text-sm text-cv-muted">
              They will receive an email invitation to join your workspace with the role you choose.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid gap-2">
              <Label className="text-sm font-bold text-cv-ink">Name</Label>
              <Input
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                className="cv-input"
                placeholder="e.g. Jane Doe"
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-bold text-cv-ink">Email</Label>
              <Input
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="cv-input"
                placeholder="jane@carepartners.co"
                type="email"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-bold text-cv-ink">Role</Label>
              <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as TeamRole)}>
                <SelectTrigger className="w-full h-10 text-sm font-bold rounded-xl border-cv-line">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALL_ROLES.map((r) => (
                    <SelectItem key={r} value={r} className="text-sm font-bold">
                      <div className="flex flex-col">
                        <span>{ROLE_LABELS[r]}</span>
                        <span className="text-[10px] font-normal text-cv-muted">{ROLE_DESCRIPTIONS[r]}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-full border-cv-line font-bold" onClick={() => setInviteOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-cv-ink text-white hover:bg-cv-ink/90 rounded-full font-bold"
              onClick={handleInvite}
              disabled={!inviteName.trim() || !inviteEmail.trim()}
            >
              <Mail className="h-4 w-4" />
              Send invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove confirmation */}
      <Dialog open={!!removeTarget} onOpenChange={(open) => !open && setRemoveTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-cv-ink">Remove team member?</DialogTitle>
            <DialogDescription className="text-sm text-cv-muted">
              {removeTarget?.name} will lose access to your workspace. They can be re-invited later if needed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-full border-cv-line font-bold" onClick={() => setRemoveTarget(null)}>
              Cancel
            </Button>
            <Button
              className="rounded-full font-bold bg-cv-red text-white hover:bg-cv-red/90"
              onClick={() => removeTarget && handleRemove(removeTarget.id)}
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PermissionIcon({ level }: { level: PermissionLevel }) {
  if (level === 'full') {
    return <Check className="h-4 w-4 text-cv-good mx-auto" />;
  }
  if (level === 'view') {
    return <Eye className="h-4 w-4 text-cv-muted mx-auto" />;
  }
  return <Minus className="h-4 w-4 text-cv-line mx-auto" />;
}
