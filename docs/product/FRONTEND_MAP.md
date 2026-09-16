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
- Partner logo/profile image with verified badge, rating, and family count
- Hero with partner intro copy and proof chips
- Careverse membership packages (Family, Family Plus, Care Circle) with plan details toggle
- Benefits overview grid (6 benefits)
- Lidia AI section
- Footer with plan links, learn links, contact info, legal links (Terms, Privacy, Refund), and membership disclaimer
- Mock purchase flow with confirmation dialog and purchased state

### Storefront Builder
- Tab navigation: Overview, Packages, Branding, Domain, Preview, Publish
- **Overview** — stat cards (storefront status, URL, visitors, conversions, revenue, commission), quick action cards (packages, domain, preview), View Storefront button
- **Packages** — toggle which Careverse packages appear on the storefront
- **Branding** — storefront name, logo upload, partner photo upload, short intro copy with character counter
- **Domain** — Careverse-hosted URL display, custom domain input with DNS configuration
- **Preview** — desktop/mobile preview that reflects builder changes (storefront name, intro copy, selected packages)
- **Publish** — draft/published status toggle, storefront checklist, publish/unpublish controls

### Partner Conversions
- Conversion list with columns: Customer, Storefront, Package, Date, Amount, Commission, Status
- Search by customer name, email, plan, ID, or storefront
- Status filter tabs (All, Pending, Approved, Paid, Reversed)
- Date filter (All time, 7 days, 30 days, 90 days)
- Storefront filter (partner's storefronts only)
- Clear filters button
- Conversion detail dialog showing customer, storefront, package, date, purchase amount, commission, status, and attribution section (tracking source, click ID, attribution state)

### Admin Conversions
- Stats: total conversions, total revenue, total commission
- Conversion list with columns: Customer, Partner, Storefront, Package, Amount, Commission, Attribution, Status, Date
- Search by customer, partner, storefront, email, attribution source, or click ID
- Status filter tabs (All, Pending, Approved, Paid, Reversed)
- Date filter (All time, 7 days, 30 days, 90 days)
- Partner filter (all partners)
- Storefront filter (all storefronts)
- Package filter (Family, Family Plus, Care Circle)
- Clear filters button
- Conversion detail dialog with full attribution info: partner, storefront, tracking source, click/attribution ID, customer, package, purchase amount, conversion date, status, attribution state

### Attribution States
- Attributed (green) — conversion successfully attributed to a partner's tracking link
- Pending (amber) — attribution being verified
- Unattributed (gray) — no clear attribution source identified
- Reversed (red) — attribution reversed due to refund or fraud

### Partner Commissions
- Stats: available balance, pending, total paid (computed from partner's commission data)
- Status filter tabs (All, Pending, Approved, Paid, Reversed) with counts
- Search by plan, conversion ID, or customer name
- List columns: Conversion, Package, Purchase Amount, Commission, Status, Date
- Commission detail dialog showing conversion reference, package, purchase amount, commission amount, commission rule + rate, status, relevant dates (created, approved, paid, reversed), and attribution reference (customer, storefront, tracking source, click ID)

### Admin Commissions
- Stats: total pending, approved, paid across all partners
- Status filter tabs (All, Pending, Approved, Paid, Reversed)
- Search by partner, plan, customer, or click ID
- List columns: Partner (with avatar), Conversion, Package, Amount, Commission, Status, Date
- Commission detail dialog showing partner, conversion, package, purchase amount, commission amount, commission rule + rate, status, all relevant dates, and attribution reference (customer, tracking source, click ID)

### Partner Payouts
- Stats: available balance, pending, total paid (computed from partner data)
- Payout setup status card showing configured bank transfer method
- Status filter tabs (All, Pending, Processing, Paid, Failed) with counts
- Search by reference or method
- List columns: Date, Amount, Method, Status, Reference
- Payout detail dialog showing amount, method, date, reference, and status

### Admin Payouts
- Stats: total available, total pending, total paid across all partners
- Status filter tabs (All, Pending, Processing, Paid, Failed)
- Search by partner name
- Per-partner summary table with columns: Partner, Available, Pending, Paid, Payout Status, Payout Date
- Partner payout detail dialog showing available balance, pending, total paid, payout status, last payout date, and full payout history with click-through to individual payout details
- Individual payout detail dialog showing partner, amount, method, date, reference, and status

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
- Summary bar: total products, available count, most popular
- Product cards with name, price, billing type, description, status/availability badges, and features list
- Click a product to open detail dialog with three tabs:
  - **Details** — editable name, description, price, and billing type
  - **Benefits** — editable benefit cards (title + description) with add/remove; package features list
  - **Availability** — editable status, availability, partner availability (ALL/CREATOR/BUSINESS/NETWORK), and popular toggle
- Edit mode toggles between view and edit with save confirmation state

### Partner Resources
- Three package tabs: Creator, Business / Agency, Network
- Default tab auto-selected based on logged-in partner's type
- Each package has curated resources: brand kits, guides, copy templates, product info, videos
- Resource cards with icon, title, description, and download/view action button
- Empty state when no resources available for a package

### Admin Reports
- Date-range filter: Last 7 days, 30 days, 90 days, All time
- Export button with success confirmation
- Global summary stats: revenue, conversions, commissions, partners, storefronts
- Revenue over time bar chart with hover tooltips
- Seven report tabs:
  - **Partners** — total/active/pending/suspended counts, creator/business/network breakdown, top partners by revenue table
  - **Storefronts** — total/live/draft/visitor counts, top storefronts by revenue with visitors and conversions
  - **Conversions** — total/approved/pending/avg value, recent conversions table with date, partner, plan, status, amount
  - **Revenue** — total/avg per storefront/top plan/monthly growth, revenue by storefront table
  - **Commissions** — total/approved/pending/avg rate, commission history table
  - **Payouts** — total/paid/pending/count, payout history table with method and status
  - **Networks** — total networks/partners/revenue/earnings, network performance table
- All report summaries computed from shared mock data (mockReportSummaries)

### Admin Settings
- Ten settings tabs:
  - **Program** — editable program name, description, default commission rate
  - **Commission** — commission rules table with add/delete, rate, scope, active/paused toggle
  - **Partners** — auto-approve toggle, W-9 requirement, min payout amount, custom domains toggle, default storefront theme
  - **Storefronts** — default intro copy, custom domains toggle, require approval toggle, max packages per storefront
  - **Tracking** — attribution window, cookie duration, first-click toggle, cross-domain toggle
  - **Email** — from email, reply-to email, test email send
  - **Integrations** — Stripe, Mailgun, Slack, Zapier, Google Analytics, Twilio with connect/disconnect
  - **Team** — team members table with role select and remove
  - **Security** — 2FA toggle, session timeout, IP allowlist
  - **General** — platform name, support email, timezone, date format, currency, maintenance mode
- Each tab has save button with saved confirmation state
- All settings use editable controls (inputs, selects, switches, textareas)

### Admin Networks
- Stats: total networks, active partners, total revenue, network earnings
- Search by network name or owner name
- Status filter tabs: All, Active, Pending, Suspended
- Network list with columns: Network, Owner, Status, Active Partners, Conversions, Revenue, Earnings
- Click a network to open detail dialog with three tabs:
  - **Overview** — mini stats (partners, conversions, revenue, earnings) and detail rows (status, total/active partners, conversion rate, avg revenue per partner, created date)
  - **Partners** — sub-partner table with name (avatar), status badge, storefront name + status, conversions, revenue, and network earnings
  - **Activity** — chronological event feed with icons, descriptions, partner names, dates, and amounts

### Partner Network
- Only visible to partners with partner type = NETWORK (non-network partners see an access-required empty state)
- Network overview stats: active partner count, conversions, revenue, network earnings
- Partner list with search by partner name or storefront name
- Table columns: Partner (with avatar), Status, Storefront (name + status), Conversions, Revenue, Earnings
- Click a partner to open detail dialog showing: status badge, partner type, storefront name, storefront status, joined date, last active, and performance breakdown (conversions, revenue, commission, network earnings)
- Recent network activity feed with event types (partner joined, conversion, payout, storefront published, commission), descriptions, partner names, dates, and amounts

### Network Mock Data
- Two networks: Marcus Care Network (5 partners, $53,800 revenue) and Bradley Care Network (3 partners, $14,400 revenue)
- Each network partner has: name, type, status, storefront name + status, conversions, revenue, commission, network earnings, joined date, last active, avatar color
- Each network has an activity feed with typed events
- Shared mock data between admin and partner network views

### Admin Emails
- Stats: campaigns count, emails sent, avg open rate, active automations
- Four tabs: Campaigns, Scheduled, Automations, Templates
- **Campaigns** — one-time broadcast list with name, audience, subject, schedule, status, sent count, open rate, and view/edit actions
- **Scheduled** — upcoming campaign sends with date, recipients, and detail dialog showing campaign, audience, subject, scheduled date, recipient count, and status; cancel send option for scheduled emails
- **Automations** — triggered email list with name, trigger, audience, template, delay, status; pause/resume toggle that updates state
- **Templates** — 7 editable email templates (Partner Approved, Account Activated, First Conversion, Storefront Published, Commission Approved, Payout Sent, No Activity); each with enable/disable toggle, trigger description, subject line, last edited date, and edit dialog with subject line input, body textarea with merge variable hints, and save functionality

### Email Templates
- Partner Approved — sent when partner status changes to ACTIVE
- Account Activated — sent when account is fully activated
- First Conversion — sent when partner records their first sale
- Storefront Published — sent when storefront goes live
- Commission Approved — sent when commission status changes to APPROVED
- Payout Sent — sent when payout status changes to PAID
- No Activity — sent when no conversions in 14 days (disabled by default)
- Merge variables: {{partner_name}}, {{commission_amount}}, {{package_name}}, {{customer_name}}, {{storefront_name}}, {{storefront_url}}, {{payout_amount}}, {{payout_method}}, {{payout_reference}}

### Partner Messages
- Conversation list showing Careverse Team threads with unread indicators
- Search across messages and last message text
- Conversation view with message bubbles (partner right, Careverse left)
- Message composer with send button (Enter to send)
- New message button creates a fresh conversation with Careverse
- Empty state when no messages exist in a conversation
- Mobile responsive: list and conversation toggle on small screens
- Only shows the logged-in partner's conversations (filtered by partner ID)

### Admin Messages
- Three-column layout: conversation list | chat thread | partner details panel
- Conversation list with search, unread indicators, and partner avatars
- Chat thread with message bubbles, scroll-to-bottom on open, and reply composer
- Partner details panel showing: avatar, name, email, status badge, partner type, joined date, last active, storefront name, storefront status, and performance stats (conversions, revenue, commission, visitors)
- Unread count badge in header
- Messages sent from partner portal appear in admin conversations (shared mock data)
- Admin replies update the conversation in real-time (local state)

---

## Phase 9 — Platform Integration & Role Access

### Role-Based Access
- Four roles: Admin, Creator, Business / Agency, Network
- Partner login page includes a role selector (Creator, Business / Agency, Network) with icons and descriptions
- Selected role sets the partner type in the auth context, which controls:
  - Sidebar navigation (Network tab only appears for Network partners)
  - Network page access (non-network partners see an access-required empty state)
  - Resources default tab (auto-selected based on partner type)
- Admin login is separate from partner login at `/admin/login`
- Role switcher available in partner sidebar dropdown (mock — for demo/testing)

### Routing Audit
- `/admin/login` — standalone login page, no admin shell, no auth guard
- `/admin/*` (authenticated) — admin layout with sidebar, header, auth guard; redirects to `/admin/login` if not admin
- `/login` — partner login with role selector; redirects to `/partner` on success
- `/partner/*` — partner layout with sidebar, header, auth guard; redirects to `/login` if not partner
- `/partner/network` — only visible to Network partners in nav; accessible by direct URL but shows access-required state for non-network partners
- `/storefront` — public storefront page
- `/storefront-builder` — storefront builder
- All sidebar items link to correct pages with `router.push()`
- Refreshing any authenticated route preserves auth state via localStorage
- Logout from admin → `/admin/login`; logout from partner → `/login`

### Shared Data Consistency
- Partners reference storefronts via `storefrontId` / `partnerId`
- Storefront data (visitors, conversions, revenue, commission) matches partner aggregate stats
- Conversions reference both `partnerId` and `storefrontId`
- Commissions are derived from conversions via `mockConversions.map()` — always in sync
- Payouts reference `partnerId` and match partner commission totals
- Networks reference `ownerId` (a partner ID) and contain sub-partners with their own storefront/conversion/revenue data
- Network activity feed references partner names that exist in the network's partner list
- Report summaries computed from the same shared mock data (mockReportSummaries)
- Admin messages and partner messages share the same mock conversation data, filtered by partner ID

### Empty / Loading / Error States
- All admin table pages (partners, storefronts, conversions, commissions, payouts) have EmptyState for no search results
- All partner table pages (conversions, commissions, payouts) have EmptyState for no search results
- Admin networks and partner network pages have EmptyState for no results
- Admin messages and partner messages have EmptyState for no conversations and no messages in a conversation
- Admin emails has EmptyState for no campaigns, no scheduled emails, no automations, no templates
- Auth guards show loading spinner during initial load and redirect
- Status notices (pending, incomplete, suspended) shown in partner layout banner

---

## Phase 10 — Storefront Checkout & Purchase Flow

### Customer Checkout (`/checkout`)
- Dedicated checkout page reached from storefront package CTAs
- URL carries product ID (`?product=prod-family-plus`) and reads partner/storefront from shared mock data
- Form sections: Customer Information (name, email), Billing Address (street, city, state, ZIP), Payment Method
- Payment method selector: Credit/Debit Card, PayPal, Bank Transfer — each shows relevant fields
- Sticky order summary sidebar: selected package, price, included features, subtotal/setup/tax breakdown, total, and "Referred by" attribution showing the partner storefront
- Complete Purchase button (disabled until form is valid) and Simulate Failed Payment button

### Checkout States
- **Checkout form** — full form with validation, payment method selection, order summary
- **Processing** — spinner with "Securely processing your membership" message
- **Success** — green check, reference number, amount, email, links to confirmation page and back to storefront
- **Failed** — red alert, "Try Again" returns to form, "Back to Storefront" returns to storefront
- **Cancelled/back** — "Back to Storefront" link in header returns to storefront at any time

### Confirmation Page (`/checkout/confirmation`)
- Dedicated confirmation page with order reference number prominently displayed
- Order details: package name, amount, payment method, date, customer email, customer name
- "What happens next" section: check email, meet Lidia AI assistant, start using benefits, manage membership
- Referred-by sidebar showing the originating partner storefront with verification badge and join date
- Support contact card (email + phone)
- Buttons: "Start Using Benefits" and "Back to Storefront"

### Partner Attribution
- Storefront page passes product ID to checkout via URL query param
- Checkout page reads partner and storefront from shared mock data (`currentPartner` / `currentPartnerStorefront`)
- Order summary in checkout shows "Referred by" with partner name and storefront identity
- Confirmation page shows originating partner storefront with verification badge
- Mock orders include `partnerId`, `partnerName`, `storefrontId`, `storefrontName` fields for admin attribution
- Completed mock orders connect to the existing conversion data structure

### Mock Data
- `MockOrder` type added with full order fields (reference, product, customer, billing, payment, attribution)
- `mockOrders` array with two completed orders referencing existing partners/storefronts
- Orders use the same product, partner, and storefront IDs as the rest of the mock data

---

## Phase 11 — Product Catalog & Package Management

### Centralized Package Source
- All package data comes from a single source (`mockProducts`) shared by Admin Products and Storefront Builder
- `MockProduct` type includes `sourceId`, `syncStatus`, and `lastSyncedAt` fields for Careverse Benefits integration
- No second package definition system — Admin Products and Storefront Builder reference the same data
- Mock sync state: all packages are `SYNCED` with a `lastSyncedAt` timestamp

### Admin Products (`/admin/products`)
- Central Careverse package catalog showing all available packages
- Stats: total packages, available count, most popular plan
- Sync status banner showing Careverse Benefits source connection, last sync time, and sync count
- "Sync from Careverse" button simulates pulling package data from the Benefits source (updates `lastSyncedAt` and `syncStatus`)
- Package cards show name, price, billing type, status, availability, sync status, description, and feature list
- Package detail dialog with three tabs:
  - **Details**: read-only name, description, price, billing type (with note that content is managed by Careverse)
  - **Benefits**: read-only benefit cards and feature list
  - **Availability**: read-only status and partner availability, plus an availability toggle (the only admin control)
- Admin can toggle whether a package is available for partner storefronts
- Admin cannot create, edit, or delete packages — no "New Product" button, no edit mode
- Package content (name, price, description, features, benefits) is read-only and comes from the Careverse Benefits source

### Package Availability
- Admin controls availability via a switch in the package detail dialog
- When set to "Coming Soon", the package is hidden from partner storefront selection
- Partners can only see and select packages with `availability === 'AVAILABLE'`
- The Storefront Builder filters packages by availability before rendering the selection list

### Partner Storefront Builder (`/storefront-builder` — Packages tab)
- Info banner explaining Careverse manages all package content
- Two sections: "Your storefront packages" (selected, with reordering) and "Available Careverse packages" (to add)
- Selected packages section shows numbered ordering with up/down arrows to reorder
- Each selected package shows position number, name, price, benefit count, and a "Remove" button
- Available packages section shows only packages with `availability === 'AVAILABLE'`
- Clicking an available package adds it to the selection
- Selected packages expand to show read-only package details (description + feature chips) with a lock icon indicating content is managed by Careverse
- Partners cannot create packages, change names, change prices, change descriptions, or edit benefits
- The storefront page references the same centralized `mockProducts` data for package display

### Shared Data Flow
```
Careverse Benefits Source (mock)
  ↓ sync
mockProducts (centralized)
  ↓ read
Admin Products (availability toggle only)
  ↓ availability filter
Storefront Builder (select + reorder only)
  ↓ selected package names
Storefront page (display to customers)
```

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
    checkout/           Checkout flow (form → processing → success/failed)
      confirmation/     Purchase confirmation page
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
