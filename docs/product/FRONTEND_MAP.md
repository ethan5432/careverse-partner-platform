# Careverse Partner Platform — Frontend Map

## Overview

Phase 1 frontend prototype of the Careverse Partner Platform. All data is mocked. No backend, authentication, tracking, or payment processing is implemented.

**Brand positioning:** Lidia is free for everyone. Building the world's largest AI-powered care network.

---

## Routes

### Public

| Route | Description |
|-------|-------------|
| `/` | Redirects to `/login` |
| `/login` | Partner login (Careverse Partners branding) |
| `/admin/login` | Admin login (Careverse Admin branding) |
| `/storefront` | Customer-facing white-label storefront |
| `/storefront-builder` | Storefront builder for partners |

### Partner (`/partner/*`)

| Route | Nav Label | Visible To |
|-------|-----------|------------|
| `/partner` | Overview | All partners |
| `/partner/storefront` | Storefront | All partners (redirects to builder) |
| `/partner/conversions` | Conversions | All partners |
| `/partner/commissions` | Commissions | All partners |
| `/partner/payouts` | Payouts | All partners |
| `/partner/network` | Network | Network partners only |
| `/partner/resources` | Resources | All partners |
| `/partner/messages` | Messages | All partners |
| `/partner/settings` | Settings | All partners |

### Admin (`/admin/*`)

| Route | Nav Label | Description |
|-------|-----------|-------------|
| `/admin/login` | — | Admin-only login (separate from partner login) |
| `/admin` | Dashboard | Platform overview with metrics, performance chart, partner/storefront tables, needs attention, recent activity |
| `/admin/partners` | Partners | Partner list with search, type + status filters, and partner detail dialog (8 tabs) |
| `/admin/storefronts` | Storefronts | Storefront list with search + status filters, and storefront detail dialog (5 tabs) |
| `/admin/conversions` | Conversions | All platform conversions |
| `/admin/commissions` | Commissions | Commission ledger with status filters |
| `/admin/payouts` | Payouts | All platform payouts |
| `/admin/networks` | Networks | Network management |
| `/admin/products` | Products | Product catalog (Family, Family Plus, Care Circle) with product detail dialog |
| `/admin/messages` | Messages | Admin-to-partner messaging (two-column layout) |
| `/admin/emails` | Emails | Email campaigns + automations |
| `/admin/reports` | Reports | Platform reports |
| `/admin/settings` | Settings | Admin settings |

---

## Role / Account States

### Partner Types
- **Creator** — Partner experience without Network
- **Business / Agency** — Partner experience without Network
- **Network** — Partner experience including Network

### Account Statuses
- **Active** — Full access
- **Pending** — Awaiting approval, limited features
- **Incomplete** — Onboarding not finished
- **Suspended** — No access, contact support

Role switching is available via the user dropdown in the partner sidebar (mock only).

---

## Navigation

### Partner Navigation
Overview, Storefront, Conversions, Commissions, Payouts, [Network]*, Resources, Messages, Settings

*Network only appears for Network partner type.

### Admin Navigation
Dashboard, Partners, Storefronts, Conversions, Commissions, Payouts, Networks, Products, Messages, Emails, Reports, Settings

---

## Shared Components

| Component | Location | Purpose |
|-----------|----------|---------|
| CareverseLogo | `components/shared/CareverseLogo.tsx` | Logo with wordmark |
| CareverseMark | `components/shared/CareverseLogo.tsx` | Logo mark only |
| PageHeader | `components/shared/PageHeader.tsx` | Page title, eyebrow, actions |
| StatCard | `components/shared/StatCard.tsx` | Metric card with icon and trend |
| StatusBadge | `components/shared/StatusBadge.tsx` | Status indicator badge |
| Avatar | `components/shared/StatusBadge.tsx` | Initials avatar with color |
| EmptyState | `components/shared/EmptyState.tsx` | Empty state placeholder |

---

## Mock Data Models

All mock data lives in `src/data/mock/`.

| Dataset | Type | Description |
|---------|------|-------------|
| mockUsers | MockUser[] | Auth users (admin + partners) |
| mockPartners | MockPartner[] | Partner CRM records |
| mockProducts | MockProduct[] | Careverse plans (Family, Family Plus, Care Circle) |
| mockStorefronts | MockStorefront[] | Partner storefronts |
| mockConversions | MockConversion[] | Conversion records |
| mockCommissions | MockCommission[] | Commission records |
| mockPayouts | MockPayout[] | Payout records |
| mockConversations | MockConversation[] | Message threads |
| mockEmailCampaigns | MockEmailCampaign[] | Email campaigns |
| mockEmailAutomations | MockEmailAutomation[] | Automated email triggers |
| mockNetworks | MockNetwork[] | Partner networks |
| mockResources | MockResource[] | Resource library items |
| mockPartnerProfile | MockPartnerProfile | Current partner profile |
| mockStorefrontSettings | MockStorefrontSettings | Storefront settings |
| mockNotificationSettings | MockNotificationSettings | Notification preferences |
| mockPayoutSetup | MockPayoutSetup | Payout method details |
| adminPerformanceByRange | Record<AdminTimeRange, AdminPerformancePoint[]> | Admin performance data by time range |
| mockAdminActivity | MockAdminActivity[] | Platform-wide activity feed |
| mockNeedsAttention | MockNeedsAttentionItem[] | Items requiring admin attention |
| mockPartnerNotes | MockPartnerNote[] | Internal partner notes |
| getPartnerActivity | (partnerId) => MockPartnerActivityItem[] | Partner activity timeline generator |

---

## Design System

### Colors
- `--ink: #18191D` — text, primary buttons
- `--body: #4A4D55` — paragraphs
- `--muted: #6B6E76` — captions, help text
- `--cream: #F6F3EE` — page background
- `--soft: #F3F1EC` — alternating sections
- `--white: #FFFFFF` — cards, inputs
- `--line: #E6E1D8` — borders
- `--red: #E1062C` — single accent
- `--night: #14151A` — footer
- `--good: #0B9B6B` — success, checks

### Typography
- Font: Inter (Avenir Next fallback)
- H1: clamp(56px, 6.7vw, 88px), 700, -0.06em tracking
- H2: clamp(38px, 5vw, 64px), 700, -0.05em tracking
- H3: 28-32px, 700, -0.03em tracking
- Body: 18-20px, 400, 1.62 line-height
- Eyebrow: 12px, 800, 0.16em tracking

### Buttons
- Primary: ink fill, white text, 999px radius, 54px height
- Secondary: white fill, ink text, 1px line border
- Red: red fill, white text (product action only)

### Cards
- White, 28px radius, 1px line border, soft shadow

---

## Major Interactions

### Partner Dashboard
- Switch between 7D/30D/90D/All time performance
- Switch between Revenue/Conversions/Commission metrics
- View storefront status with quick links to view/edit
- Recent conversions table

### Customer Storefront
- Browse Careverse packages (Family, Family Plus, Care Circle)
- Mock purchase flow with confirmation dialog
- Lidia AI section
- Benefits grid

### Storefront Builder
- Tab navigation: Overview, Packages, Branding, Domain, Preview, Publish
- Toggle package selection
- Edit storefront name, logo, intro copy
- Configure custom domain
- Desktop/mobile preview
- Publish/unpublish toggle

### Admin Dashboard
- Primary metrics: Revenue, Conversions, Commissions, Active Partners
- Performance chart with 7D/30D/90D/All time toggle and Revenue/Conversions/Commission metric switch
- Partner performance table (top 5 by revenue)
- Storefront performance table (top 5 by revenue)
- Needs Attention section (applications, onboarding, payout issues, storefront issues, account issues)
- Recent Activity feed (applications, approvals, storefronts published, conversions, commissions, payouts)

### Admin Partners CRM
- Search and filter partners by type (All, Creator, Business, Network) and status (All, Active, Pending, Incomplete, Suspended)
- Click partner to open detail dialog with 8 tabs:
  - **Overview** — name, type, status, contact, joined, performance summary, commercial summary
  - **Activity** — timeline (application, approval, activation, storefront created/published, conversions, commissions, messages)
  - **Conversions** — partner's conversions with click-to-detail dialog
  - **Commissions** — partner's commissions with click-to-detail calculation breakdown
  - **Storefront** — storefront info with View/Edit actions
  - **Messages** — conversation thread with reply and new message capability (mock state)
  - **Notes** — internal-only notes with add capability (mock local state, not visible to partner)
  - **Settings** — account info with status controls (Active, Pending, Incomplete, Suspended)

### Admin Storefronts
- Search and filter storefronts by status (All, Active, Draft)
- Click storefront to open detail dialog with 5 tabs:
  - **Overview** — name, URL, status, partner, visitors, conversions, revenue, commission, intro copy
  - **Products** — assigned Careverse packages
  - **Branding** — name, intro copy, brand colors
  - **Domain** — default URL, custom domain, domain status
  - **Analytics** — visitors, conversions, conversion rate, 4-week visitor chart

### Admin Products
- Three Careverse plans: Family, Family Plus, Care Circle
- Click product card to open detail dialog with full product information

### Admin Emails
- Campaigns tab with status indicators
- Automations tab with active/paused toggle

---

## File Structure

```
src/
  app/
    login/              Partner login
    admin/
      login/            Admin login
      layout.tsx        Admin shell with sidebar nav
      page.tsx          Admin dashboard
      partners/         Partner CRM
      storefronts/      Storefront management
      conversions/      All conversions
      commissions/      All commissions
      payouts/          All payouts
      networks/         Network management
      products/         Product catalog
      messages/         Admin messaging
      emails/           Email campaigns + automations
      reports/          Platform reports
      settings/         Admin settings
    partner/
      layout.tsx        Partner shell with sidebar nav
      page.tsx          Partner dashboard (Overview)
      conversions/      Partner conversions
      commissions/      Partner commissions
      payouts/          Partner payouts
      network/          Network (Network partners only)
      resources/        Resource library
      messages/         Partner messaging
      settings/         Partner settings
    storefront/         Customer storefront
    storefront-builder/ Storefront builder
  components/
    shared/             Shared Careverse components
    ui/                 shadcn/ui primitives
  data/
    mock/               Mock data and types
  hooks/
    useMockAuth.tsx     Mock authentication context
  lib/                  Utilities
```

---

## Backend Boundary

**Frontend (now):** UI, navigation, layouts, charts, tables, modals, forms, mock state, empty/loading/error/success states, responsive behavior, role-gated screens, storefront preview, builder interactions.

**Backend (later):** Database, authentication, attribution, tracking, S2S, payment events, conversion ingestion, commission engine, commission ledger, payouts, tax, webhooks, queues, production email, integrations.

Backend API specifications will be documented in `docs/backend/`.
