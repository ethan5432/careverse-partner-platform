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
| `/storefront` | Customer-facing storefront (reads saved partner config) |
| `/partner/store` | Partner store editor (builder + persistence) |

### Partner (`/partner/*`)

| Route | Nav Label | Visible To |
|-------|-----------|------------|
| `/partner` | Overview | All partners |
| `/partner/store` | Store | All partners |
| `/partner/conversions` | Conversions | All partners |
| `/partner/commissions` | Commissions | All partners |
| `/partner/payouts` | Payouts | All partners |
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
| `/admin/products` | Products | Product catalog (Family, Family Plus, Care Circle) with product detail dialog |
| `/admin/messages` | Messages | Admin-to-partner messaging (two-column layout) |
| `/admin/emails` | Emails | Email campaigns + automations |
| `/admin/reports` | Reports | Platform reports |
| `/admin/settings` | Settings | Admin settings |

---

## Role / Account States

### Partner Types
- **Creator** — Partner experience for content creators and influencers
- **Business / Agency** — Partner experience for agencies and businesses

### Account Statuses
- **Active** — Full access
- **Pending** — Awaiting approval, limited features
- **Incomplete** — Onboarding not finished
- **Suspended** — No access, contact support

Role switching is available via the user dropdown in the partner sidebar (mock only).

---

## Navigation

### Partner Navigation
Overview, Store, Conversions, Commissions, Payouts, Resources, Messages, Settings

### Admin Navigation
Dashboard, Partners, Storefronts, Conversions, Commissions, Payouts, Products, Messages, Emails, Reports, Settings

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

### Customer Storefront (`/storefront`)
- Reads saved storefront configuration from localStorage (falls back to mock data if none saved)
- Renders sections dynamically based on the partner's configured section order
- Partner logo/profile image with verified badge, rating, and family count
- Hero with partner headline, supporting copy, CTA text, and proof chips
- Creator video sections render actual embedded or uploaded videos
- Careverse membership packages (only the partner's selected packages) with plan details toggle
- Benefits overview grid (6 benefits)
- About section (if configured)
- Lidia AI section
- Footer with plan links, learn links, contact info, legal links, and membership disclaimer
- Mock purchase flow with confirmation dialog and purchased state

### Partner Store Editor (`/partner/store`)
- The main store management area for partners (replaces the old `/storefront-builder`)
- Header includes "View Store" button (opens `/storefront` in same tab) and Save button
- Tab navigation: Overview, Sections, Packages, Branding, Positioning, Creator Content, Domain, Preview, Publish
- **Overview** — stat cards (status, URL, visitors, conversions, revenue, selected packages), quick action cards
- **Sections** — reorderable section list (Hero, Creator Video, Packages, Benefits, About) with up/down arrows, visibility toggle, and add creator video section
- **Packages** — select and reorder Careverse packages (content is Careverse-managed, read-only)
- **Branding** — storefront name, functional logo upload, functional partner photo upload, brand presentation tagline, intro copy, presentation mode (partner-first, Careverse-first, co-branded)
- **Positioning** — hero headline, hero supporting copy, CTA button text, about/positioning content
- **Creator Content** — add video content blocks with embed URL or direct video upload, optional title and caption, layout selection (1/2/3 columns), reorder and remove blocks, multiple video blocks supported
- **Domain** — Careverse-hosted URL display, custom domain input with DNS configuration
- **Preview** — desktop/mobile preview that reflects the exact section order, actual video rendering, branding, positioning, and selected packages
- **Publish** — draft/published status toggle, storefront checklist, publish/unpublish controls
- **Persistence** — all configuration saved to localStorage; uploaded videos stored in IndexedDB; changes preserved across refreshes and reopening

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
- Search and filter partners by type (All, Creator, Business) and status (All, Active, Pending, Incomplete, Suspended)
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
  - **Availability** — editable status, availability, partner availability (ALL/CREATOR/BUSINESS), and popular toggle
- Edit mode toggles between view and edit with save confirmation state

### Partner Resources
- Two package tabs: Creator, Business / Agency
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
- `/storefront` — public storefront page (reads saved config from localStorage)
- `/partner/store` — partner store editor (writes config to localStorage + IndexedDB)
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

### Partner Store Editor (`/partner/store` — Packages tab)
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
Storefront page (display to customers, reads from saved config)
```

---

## Phase 12 — White-Label Storefront Customization & Creator Content

### Storefront Branding (expanded)
- Storefront name (editable)
- Logo/profile image (upload UI)
- Partner photo (optional upload)
- Brand presentation tagline (short text under storefront name)
- Short intro copy (200-char textarea)

### Storefront Positioning (new tab)
- Hero headline (main headline visitors see first)
- Hero supporting copy (160-char text below headline)
- CTA button text (customizable call-to-action text)
- About / positioning content (500-char textarea for about section)

### Careverse Packages (unchanged from Phase 11)
- Partners select from available centralized Careverse packages
- Reorder selected packages with up/down arrows
- Cannot create, edit, or modify package content

### Creator Content (new tab)
- Add video content blocks using either:
  - Video embed URL (YouTube, Vimeo, etc.)
  - Direct video upload (file picker UI)
- Each content block supports:
  - Video (embed URL or upload)
  - Optional title (60 char max)
  - Optional caption (120 char max)
- Content placement options:
  - Top (above hero)
  - Middle (between hero and packages)
  - Bottom (below about section)
- Content layout options:
  - 1 column
  - 2 columns
  - 3 columns
- Reorder content blocks with up/down arrows
- Remove content blocks with trash button
- Empty state with "Add your first content block" CTA

### Storefront Preview (updated)
- Live preview reflects all branding, positioning, packages, and creator content changes
- Desktop and mobile preview modes
- Preview renders: header (logo + name + brand presentation), TOP content blocks, hero (headline + supporting copy + CTA button), MIDDLE content blocks, packages grid, about section, BOTTOM content blocks
- Content blocks show video placeholder with play icon, title, caption, and selected layout
- Packages show name, price, and CTA button text

### Mock Data Extensions
- `MockStorefront` extended with: `heroHeadline`, `heroSupportingCopy`, `ctaText`, `aboutContent`, `brandPresentation`, `creatorContent`
- New types: `MockCreatorContent` (id, source, url, title, caption, placement, layout, order), `ContentSource` ('EMBED' | 'UPLOAD'), `ContentPlacement` ('TOP' | 'MIDDLE' | 'BOTTOM'), `ContentLayout` ('ONE_COLUMN' | 'TWO_COLUMN' | 'THREE_COLUMN')
- First storefront (Marcus Care Partners) has default branding, positioning, and two mock content blocks
- Package data remains connected to centralized `mockProducts` from Phase 11

### Builder Tabs
- Overview, Packages, Branding, Positioning, Creator Content, Domain, Preview, Publish
- All tabs functional on desktop and mobile (horizontal scroll tab bar)

---

## Phase 13 — Checkout + Purchase Flow

### Customer Checkout (`/checkout`)
- Connects from partner storefront package CTAs via `?product=<id>` URL parameter
- Shows selected package, price, customer name, email, billing address, payment method UI, and order summary
- Payment methods: Credit/Debit Card, PayPal, Bank Transfer (each with relevant fields)
- Order summary sidebar shows package, features, cost breakdown, and partner attribution
- "Complete Purchase" button with validation (disabled until form is valid)
- "Simulate Failed Payment" button to test failure state
- "Cancel" button to test cancelled state

### Checkout States
- **Form**: Full checkout form with customer info, billing, and payment method
- **Processing**: Spinner with "Processing Payment..." message
- **Success**: Confirmation summary with reference, amount, email, and "View Confirmation" button
- **Failed**: Error message with "Try Again" and "Back to Storefront" buttons
- **Cancelled**: Cancelled message with "Back to Storefront" and "Restart Checkout" buttons

### Partner Attribution
- Partner and storefront context carried from storefront through checkout via shared mock data
- Purchase is associated with: partner ID, partner name, storefront ID, storefront name
- Attribution visible in order summary sidebar ("Referred by" section)

### Purchase Confirmation (`/checkout/confirmation`)
- Reads order from sessionStorage (fresh checkout) or falls back to mock data via reference param
- Shows: package purchased, amount, confirmation/reference number, customer email, customer name, payment method, date
- "What happens next" section with 4 steps (check email, meet Lidia, start benefits, manage membership)
- **"Go to Lidia" CTA** — primary button that navigates to `/lidia`
- Membership card showing membership ID, plan, start date, monthly price, and benefit chips with ACTIVE status badge
- Referred by section with partner verification badge
- Support contact card

### Membership State
- On successful mock purchase, a `MockMembership` is created linking:
  - Customer (name, email, customer ID)
  - Membership (ID, status ACTIVE, start date, benefits)
  - Careverse Package (product ID, name, price, benefits from centralized catalog)
  - Partner attribution (partner ID, storefront ID)
  - Order reference (order ID, reference number)
- Membership stored in sessionStorage for confirmation page retrieval
- `MockMembership` type includes: id, customerId, customerName, customerEmail, productId, productName, productPrice, status, startDate, endDate, partnerId, partnerName, storefrontId, storefrontName, orderId, orderReference, benefits, benefitDetails, humanHelpEligible
- Two mock memberships exist for the two mock orders
- Structured so Lidia can use membership data in the next phase

### Complete Flow
```
Partner storefront → Package CTA → Checkout (?product=id)
  → Complete Purchase → Processing → Success
  → View Confirmation → Go to Lidia (/lidia)

Alternative paths:
  → Simulate Failed Payment → Failed state → Try Again / Back to Storefront
  → Cancel → Cancelled state → Back to Storefront / Restart Checkout
```

### Data Extensions
- `MockOrder.status` now includes `CANCELLED`
- `MockOrder` has optional `membershipId` field
- New `MockMembership` type and `mockMemberships` array
- `mockMemberships` export added to mock data index
- Order and membership passed via sessionStorage between checkout and confirmation

---

## Phase 14 — Lidia + Membership Handoff

### Lidia Member Experience (`/lidia`)
- Post-purchase member experience where Lidia (AI care assistant) greets the customer by name
- Reads membership from sessionStorage (fresh checkout) or `?membership=<id>` query param, falls back to first mock membership
- If no membership found, shows a "free for everyone" fallback with link to browse plans
- Lidia uses the customer's actual purchased package — not generic package information

### Lidia Chat Interface
- Welcome banner with customer's first name and purchased plan name
- Conversational chat UI with:
  - Lidia messages (left-aligned, dark avatar with heart icon)
  - Member messages (right-aligned, ink background)
  - Typing indicator with animated dots
  - Quick-reply chips on Lidia messages (clickable suggestions)
  - Text input with send button
- Lidia responds to member questions about:
  - What they purchased (plan, price, status, start date, referring partner)
  - Benefit explanations (lists all benefit details with titles and descriptions)
  - How to use benefits (step-by-step guide)
  - Care allowance (how it works, monthly reset, eligible services)
  - Included services (no additional cost, no waiting period)
  - Finding care services (primary care, specialists, urgent care, wellness programs)
  - Human help/advocate (eligibility, phone, email, hours)
  - Cancellation/refund policy
  - Specific service types (primary care, specialist, urgent care, wellness)
  - Fallback response for unrecognized queries

### Membership Context Sidebar
- Membership card: ID, customer name, plan, price, start date, renewal date, ACTIVE status badge
- Benefits card: expandable list of all benefit details (title + description), click to expand/collapse
- Human help card (if eligible): dedicated health advocate, phone, email, hours
- Referred by card: partner name and verification badge

### Purchase → Membership Handoff
- Checkout creates a `MockMembership` with:
  - Customer name and email
  - Purchased Careverse package (product ID, name, price)
  - Active membership status
  - Membership start date (today) and end date (1 year from today)
  - Applicable package benefits (from centralized product `benefits` array)
  - Benefit details (from centralized product `benefitDetails` array)
  - Human help eligibility (true for all plans with health advocacy)
  - Partner and storefront attribution
- Membership stored in sessionStorage and passed via `?membership=<id>` query param
- Confirmation page "Go to Lidia" CTA passes membership ID to `/lidia?membership=<id>`

### Data Structure
- Relationship: Customer → Membership → Careverse Package → Benefits
- Uses centralized package data from Phase 11 (`mockProducts` with `benefits` array of `{ title, description }`)
- `MockMembership` extended with: `endDate`, `benefitDetails` (array of `{ title, description }`), `humanHelpEligible` (boolean)
- Mock memberships updated with end dates, benefit details, and human help eligibility
- Checkout creates membership with `benefitDetails` from the centralized product's `benefits` array

### Complete Flow
```
Storefront → Package CTA → Checkout → Purchase → Confirmation
  → Go to Lidia (/lidia?membership=id)
  → Lidia greets customer by name with their purchased plan
  → Customer asks about benefits, care services, or human help
  → Lidia responds with membership-specific information
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
    storefront/         Customer storefront (reads saved config)
    checkout/           Checkout flow (form → processing → success/failed)
      confirmation/     Purchase confirmation page
    lidia/              Lidia AI care assistant (member experience)
    partner/store/      Partner store editor (builder + persistence)
  components/
    shared/             Shared Careverse components
    ui/                 shadcn/ui primitives
  data/
    mock/               Mock data and types
  hooks/
    useMockAuth.tsx     Mock authentication context
  lib/
    store-persistence.ts  Storefront config (localStorage) + video files (IndexedDB)
```

---

## Backend Boundary

**Frontend (now):** UI, navigation, layouts, charts, tables, modals, forms, mock state, empty/loading/error/success states, responsive behavior, role-gated screens, storefront preview, builder interactions.

**Backend (later):** Database, authentication, attribution, tracking, S2S, payment events, conversion ingestion, commission engine, commission ledger, payouts, tax, webhooks, queues, production email, integrations.

Backend API specifications will be documented in `docs/backend/`.

---

## Phase 15 — Partner Store Architecture & Persistence

### Partner Store Navigation
- Sidebar nav item renamed from "Storefront" to "Store"
- Routes to `/partner/store` (the partner's store management area)
- Partners are no longer sent directly to `/storefront` from the sidebar
- The customer-facing storefront remains a separate route at `/storefront`

### Partner Store Editor (`/partner/store`)
- Replaces the old `/storefront-builder` page
- "Edit Store" is the main view with a clear "View Store" button in the header that opens the actual customer-facing storefront (`/storefront`)
- All existing storefront builder functionality moved here: Packages, Branding, Positioning, Creator Content, Domain, Preview, Publish
- Partner dashboard "Edit storefront" button now links to `/partner/store`

### Reorderable Store Sections
- Store sections are now reorderable as actual sections, not just Top/Middle/Bottom placement
- Editable section order supports: Hero, Creator Video/Content, Packages, Benefits, About, and additional creator video blocks
- Partners can move sections up and down with arrow buttons
- Sections can be toggled visible/hidden
- Additional creator video sections can be added
- The Preview tab reflects the exact section order
- The public storefront renders sections in the saved order

### Creator Video Content (enhanced)
- Supports video embed URLs (YouTube, Vimeo, etc.) with live iframe rendering
- Supports direct video file upload (MP4, WebM, OGG)
- Uploaded videos are stored in IndexedDB and their references are preserved in the storefront configuration
- Video blocks store the selected video on the content block (videoId for uploads, url for embeds)
- Actual video renders in both the Preview tab and on the public storefront
- Optional title and caption preserved
- Multiple video blocks supported
- Video blocks can be reordered

### Branding (enhanced)
- Logo upload is now functional (file picker, image preview, stored as data URL in localStorage)
- Partner photo upload is now functional (file picker, image preview, stored as data URL in localStorage)
- Existing partner branding fields preserved (storefront name, brand presentation tagline, intro copy)
- Presentation mode selector: partner-first, Careverse-first, co-branded
- Uploaded logo renders in the storefront header and partner profile card
- Uploaded partner photo renders in the About section

### Persistence (temporary browser-based)
- **localStorage** stores the complete storefront configuration: branding, positioning, selected/reordered packages, section order, creator content metadata, publish state, domain settings, and branding mode
- **IndexedDB** stores uploaded video files and preserves their references (videoId) in the storefront configuration
- Configuration is loaded when `/partner/store` opens
- Changes are saved when the user clicks Save (or Cmd/Ctrl+S)
- The public storefront reads the saved configuration from localStorage on load
- Uploaded videos are retrieved from IndexedDB and rendered as object URLs on the public storefront
- Everything persists across refreshes and reopening the site in the same browser
- This is a temporary mock persistence layer designed to be replaced by the real backend/database and storage later
- No backend required for this step

### Package Identity (unchanged)
- Package identity, pricing, benefits, and core package content remain controlled by Careverse
- Partners can select and reorder packages but cannot edit package definitions
- Package data comes from the centralized `mockProducts` source (Phase 11)
- Package features and benefits are displayed as read-only with lock icons in the editor

### Public Storefront (updated)
- Reads saved storefront configuration from localStorage on page load
- Falls back to mock data if no saved configuration exists
- Renders sections dynamically in the exact order configured by the partner
- Renders actual embedded videos (iframe) and uploaded videos (HTML5 video element)
- Shows only the partner's selected packages (not all available packages)
- Uses the partner's configured hero headline, supporting copy, CTA text, and about content
- Displays uploaded logo and partner photo when configured
- Footer plan links reflect the partner's selected packages

### View Store
- The "View Store" button in the store editor header always opens `/storefront`
- The public storefront always reflects the latest saved configuration
- No intermediate steps — one click from editor to live storefront

### Data Extensions
- New `StoreSection` type: `{ id, type: StoreSectionType, visible }` where `StoreSectionType` = `'hero' | 'creatorVideo' | 'packages' | 'benefits' | 'about'`
- `MockStorefront` extended with optional `sections: StoreSection[]`
- `MockCreatorContent` extended with optional `videoId` field for uploaded video references
- New `StorefrontConfig` interface in `store-persistence.ts` for the persisted configuration shape
- New `src/lib/store-persistence.ts` module with localStorage config functions and IndexedDB video file functions

### Complete Flow
```
Partner dashboard → Store (sidebar) → /partner/store (editor)
  → Edit sections, packages, branding, positioning, creator content
  → Save (writes to localStorage + IndexedDB)
  → View Store → /storefront (reads from localStorage + IndexedDB)
  → Customer sees the exact configured storefront
```

---

## Phase 16 — Frontend Interaction Audit & Resource Asset System

### Resource Persistence (localStorage + IndexedDB)
- **`src/lib/resource-persistence.ts`** — reusable utility for resource catalog and asset files
- **localStorage** stores the resource catalog (metadata: title, type, audience, description, URL, publish state, sort order, asset source info)
- **IndexedDB** stores uploaded asset files (PDF, PNG/JPG/WEBP, MP4/MOV, DOC/DOCX, XLS/XLSX, PPT/PPTX, ZIP)
- Resources survive refreshes and reopening the browser
- Partner Resources reads the same persisted catalog as Admin Resources
- Seeded resources start with empty URLs and no uploaded file — shown as "Asset not available yet" until an admin uploads an asset or sets a valid external URL

### Admin Resources (`/admin/resources`)
- Full CRUD: create, edit, delete/archive, publish/unpublish, reorder
- Audience assignment: Creator, Business / Agency, All Partners
- Resource types: Guide, Brand Asset, Copy/Template, Product Info, Video, Download, External Link
- Asset source: Upload File or External URL (toggle)
- Upload supports: PDF, PNG/JPG/WEBP/GIF, MP4/MOV/WEBM, DOC/DOCX, XLS/XLSX, PPT/PPTX, ZIP, TXT/CSV
- Max file size: 100 MB
- Shows filename, file size, file extension, and whether resource is an uploaded asset or external URL
- Replace uploaded file, remove uploaded file
- Preview opens in-browser for supported formats (images, video, PDF)
- Download for all uploaded assets
- External URL resources open the actual URL
- Unsupported file types and oversize files show a clear error
- Unavailable resources (no file, no URL) show "Asset not available yet" and buttons are disabled

### Partner Resources (`/partner/resources`)
- Three tabs: Creator, Business / Agency, All Partners (default auto-selected by partner type)
- Only published resources matching the partner's audience (including "All Partners") are shown
- Resource cards show icon, title, description, filename/size (if uploaded), and View/Download button
- **View** opens an in-browser viewer for images, videos, and PDFs
- **Download** downloads the actual uploaded file
- **External URL** resources open the actual external link in a new tab
- Resources without an asset show "Asset not available yet" with a disabled button
- Empty state explains what will appear and offers a "Message Careverse" action

### Frontend Button/Link Audit — All Fixed
- All `<Button>` and `<button>` controls have meaningful handlers
- No `href="#"` links remain — all point to real routes or external URLs
- No `onClick={() => {}}` empty handlers remain
- All navigation actions point to real current routes

### Admin Email Center Fixes
- **New Campaign** — opens a create dialog with name, audience, subject, and schedule fields; creates a draft campaign in state
- **Campaign View** — opens a detail dialog showing all campaign fields with an Edit button for drafts
- **Campaign Edit** — opens an edit dialog pre-filled with campaign data; saves changes to state
- **New Automation** — opens a create dialog with name, trigger, audience, template, and delay fields; creates an active automation in state
- **Cancel send** — cancels a scheduled email, updating its status to CANCELLED in state

### Admin Partners Fixes
- **Add Partner** — navigates to the signup page
- **Approve** — updates the partner's status to ACTIVE in state, records the approval event in the activity timeline, checks the approval email automation configuration, and shows the correct email status (QUEUED if configured, NOT_CONFIGURED if not)
- **View storefront** — navigates to `/storefront`
- **Edit storefront** — navigates to `/partner/store`

### Admin Storefronts Fixes
- **New Storefront** — navigates to `/partner/store`
- **View storefront** — navigates to `/storefront`
- **Open builder** — navigates to `/partner/store`

### Admin Products Fixes
- **View source** — links to the actual Careverse website (external link, opens in new tab)

### Admin Settings Fixes
- **Add Rule** — opens a create dialog with name, rate, and scope fields; adds the rule to state
- **Invite Member** — opens a create dialog with email and role fields; adds the member to state
- **Remove team member** — removes the member from state (except Owner)
- **Integration toggle** — actually toggles the connected state in state
- **Admin bell icon** — links to `/admin/messages` instead of being a dead button

### Partner Payouts Fixes
- **Manage method / Add payout method** — navigates to `/partner/settings`
- **Set up payouts** (empty state) — navigates to `/partner/settings`

### Partner Commissions Fixes
- **Share your store** (empty state) — navigates to `/partner` dashboard

### Get Started Checklist Fixes
- **Undo condition** — fixed: the Undo button now appears for all completed items (was using an incorrect `!onboarding[item.key] === false` condition that never evaluated to true)
- **Nested button** — fixed: the outer element is now a `<div>` with role/onClick/onKeyDown for accessibility, and the Undo button is a proper separate `<button>` that stops propagation

### Storefront Builder Redirect
- `/storefront-builder` now redirects to `/partner/store` (the replacement route)
- The old builder page with its fake save button is gone

### Dead Link Fixes
- Admin login "Forgot password?" — links to `/forgot-password`
- Signup Terms of Service / Privacy Policy — link to external Careverse policy pages
- Storefront footer Terms / Privacy / Refund Policy — link to external Careverse policy pages

### Store Health Component
- Shows "Ready" (green) when all onboarding steps are complete
- Shows "Needs attention" (amber) with a list of specific incomplete items
- Each incomplete item links directly to the page where it can be completed

### Partner Notifications
- Real notification dropdown in partner top bar (replaces hardcoded bell)
- Notification types: application approved, account activated, storefront published, new conversion, commission approved, payout sent/failed, domain connected, upload failed
- Unread count badge, mark as read, mark all as read
- Clicking a notification deep-links to the relevant area

### Publish Success Dialog
- After publishing a store, shows "Your store is live!" with the store URL
- Buttons: View Store, Copy Link, Share Store

### Test Store Dialog
- Walks the seller through the customer journey: store → package → checkout → confirmation
- "Start test" navigates to the live storefront

### Save States
- Store editor shows unsaved changes / saving / saved / error states via a badge next to the save button
- Save flow properly transitions through states with timeout

### Profile / Store Separation
- Settings page clearly labels Profile as "Your personal identity as a partner" and Storefront as "Your public store name that customers see"
- Explicit notes that changing one will not change the other

### Support Access
- Reusable support card on store editor, conversions, commissions, payouts, and settings pages
- Direct "Contact Careverse Support" action links to `/partner/messages`
