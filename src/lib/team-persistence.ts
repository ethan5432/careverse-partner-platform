export type TeamRole = 'OWNER' | 'ADMIN' | 'MANAGER' | 'EDITOR' | 'ANALYST' | 'SUPPORT';

export type TeamMemberStatus = 'ACTIVE' | 'PENDING' | 'REMOVED';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  status: TeamMemberStatus;
  invitedAt: string;
  joinedAt?: string;
}

const TEAM_KEY = 'careverse_team_members';

const DEFAULT_TEAM: TeamMember[] = [
  {
    id: 'tm-owner',
    name: 'Marcus Johnson',
    email: 'marcus@carepartners.co',
    role: 'OWNER',
    status: 'ACTIVE',
    invitedAt: '2025-03-22T10:00:00Z',
    joinedAt: '2025-03-22T10:00:00Z',
  },
  {
    id: 'tm-admin-1',
    name: 'Sarah Lee',
    email: 'sarah@carepartners.co',
    role: 'ADMIN',
    status: 'ACTIVE',
    invitedAt: '2025-04-01T12:00:00Z',
    joinedAt: '2025-04-02T09:00:00Z',
  },
  {
    id: 'tm-editor-1',
    name: 'James Park',
    email: 'james@carepartners.co',
    role: 'EDITOR',
    status: 'ACTIVE',
    invitedAt: '2025-05-15T14:00:00Z',
    joinedAt: '2025-05-16T10:00:00Z',
  },
  {
    id: 'tm-analyst-1',
    name: 'Priya Sharma',
    email: 'priya@carepartners.co',
    role: 'ANALYST',
    status: 'PENDING',
    invitedAt: '2026-09-10T11:00:00Z',
  },
];

export function loadTeamMembers(): TeamMember[] {
  if (typeof window === 'undefined') return DEFAULT_TEAM;
  try {
    const raw = localStorage.getItem(TEAM_KEY);
    if (!raw) return DEFAULT_TEAM;
    const parsed = JSON.parse(raw) as TeamMember[];
    if (!Array.isArray(parsed)) return DEFAULT_TEAM;
    return parsed;
  } catch {
    return DEFAULT_TEAM;
  }
}

export function saveTeamMembers(members: TeamMember[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TEAM_KEY, JSON.stringify(members));
}

export function inviteTeamMember(name: string, email: string, role: TeamRole): TeamMember {
  const member: TeamMember = {
    id: `tm-${Date.now()}`,
    name,
    email,
    role,
    status: 'PENDING',
    invitedAt: new Date().toISOString(),
  };
  const members = loadTeamMembers();
  members.push(member);
  saveTeamMembers(members);
  return member;
}

export function updateTeamMemberRole(id: string, role: TeamRole): void {
  const members = loadTeamMembers();
  const idx = members.findIndex((m) => m.id === id);
  if (idx >= 0 && members[idx].role !== 'OWNER') {
    members[idx].role = role;
    saveTeamMembers(members);
  }
}

export function removeTeamMember(id: string): void {
  const members = loadTeamMembers().filter((m) => m.id !== id || m.role === 'OWNER');
  saveTeamMembers(members);
}

export function getTeamMemberCount(): number {
  return loadTeamMembers().filter((m) => m.status !== 'REMOVED').length;
}

// ─── Permission model ──────────────────────────────────────────────────────

export type PermissionArea =
  | 'storefronts'
  | 'content'
  | 'domains'
  | 'campaigns'
  | 'analytics'
  | 'commissions'
  | 'resources'
  | 'settings';

export type PermissionLevel = 'full' | 'view' | 'none';

export const PERMISSION_AREAS: { key: PermissionArea; label: string; description: string }[] = [
  { key: 'storefronts', label: 'Storefronts', description: 'Create, edit, publish, and manage storefronts' },
  { key: 'content', label: 'Content', description: 'Edit storefront content, videos, and copy' },
  { key: 'domains', label: 'Domains', description: 'Configure and verify custom domains' },
  { key: 'campaigns', label: 'Sharing & Campaigns', description: 'Create and manage campaign and sharing links' },
  { key: 'analytics', label: 'Analytics', description: 'View conversion, revenue, and performance reports' },
  { key: 'commissions', label: 'Commissions', description: 'View commissions and payout details' },
  { key: 'resources', label: 'Resources', description: 'Access the partner resource library' },
  { key: 'settings', label: 'Partner Settings', description: 'Manage account, profile, and payout settings' },
];

export const ROLE_LABELS: Record<TeamRole, string> = {
  OWNER: 'Owner',
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  EDITOR: 'Editor',
  ANALYST: 'Analyst',
  SUPPORT: 'Support',
};

export const ROLE_DESCRIPTIONS: Record<TeamRole, string> = {
  OWNER: 'Full control over everything. Cannot be removed or changed.',
  ADMIN: 'Full access to all areas except removing or changing the Owner.',
  MANAGER: 'Manage storefronts, content, campaigns, and view analytics and commissions.',
  EDITOR: 'Edit storefront content and manage campaigns. No access to settings or commissions.',
  ANALYST: 'View analytics, conversions, and commissions. No editing access.',
  SUPPORT: 'View storefronts and resources to assist customers. No editing or financial access.',
};

export const ROLE_PERMISSIONS: Record<TeamRole, Record<PermissionArea, PermissionLevel>> = {
  OWNER: {
    storefronts: 'full',
    content: 'full',
    domains: 'full',
    campaigns: 'full',
    analytics: 'full',
    commissions: 'full',
    resources: 'full',
    settings: 'full',
  },
  ADMIN: {
    storefronts: 'full',
    content: 'full',
    domains: 'full',
    campaigns: 'full',
    analytics: 'full',
    commissions: 'full',
    resources: 'full',
    settings: 'full',
  },
  MANAGER: {
    storefronts: 'full',
    content: 'full',
    domains: 'view',
    campaigns: 'full',
    analytics: 'full',
    commissions: 'view',
    resources: 'full',
    settings: 'view',
  },
  EDITOR: {
    storefronts: 'full',
    content: 'full',
    domains: 'none',
    campaigns: 'full',
    analytics: 'view',
    commissions: 'none',
    resources: 'full',
    settings: 'none',
  },
  ANALYST: {
    storefronts: 'view',
    content: 'none',
    domains: 'none',
    campaigns: 'view',
    analytics: 'full',
    commissions: 'view',
    resources: 'view',
    settings: 'none',
  },
  SUPPORT: {
    storefronts: 'view',
    content: 'none',
    domains: 'none',
    campaigns: 'view',
    analytics: 'view',
    commissions: 'none',
    resources: 'full',
    settings: 'none',
  },
};
