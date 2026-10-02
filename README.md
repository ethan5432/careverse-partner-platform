# Careverse Partner Platform

A customized fork of [Refferq](https://github.com/Refferq/Refferq), an open-source affiliate management platform, adapted and deployed as the partner and affiliate platform for Careverse. Built as part of my growth and distribution work with Careverse.

## What I built on top of Refferq

- Built a 6-step white-label storefront builder (brand → packages → story → domain → preview → publish) so Careverse partners can create and publish their own branded storefronts — with custom colors, fonts, logo, hero copy, and video — without technical help.
- Built the public-facing partner storefront page that loads each partner's configuration and displays Careverse care packages, testimonials, FAQs, and video content, routing customers to checkout.
- Built a session-persistent customer attribution system that captures referral parameters (partner ref, campaign ID, UTM source, click ID) from storefront URLs and carries them through checkout and confirmation, so every conversion is credited to the correct partner.
- Built a commission campaign management system for admins with configurable commission structures (flat rate, revenue-share tiers, fixed amounts per product), campaign scheduling, partner and product scoping, version history, and performance tracking.
- Built a multi-step partner signup flow that branches by partner type — creator (social platforms, follower counts) vs. business entity (entity type, category, operating duration) — and routes each to the appropriate onboarded dashboard.
- Built a partner integrations area for managing API keys (with permission scopes) and webhook endpoints (with event subscriptions), enabling external tools to connect to the platform programmatically.
- Added a white-label settings system where eligible partners can brand the platform with their own logo, colors, fonts, custom domain, and email sender, subject to admin approval and required Careverse disclosures.

## Why a fork instead of building from scratch

Refferq already handled the core of an affiliate program: partner accounts, referral tracking, commissions, and payouts. Starting from a proven open-source base let me spend my time on what Careverse specifically needed instead of rebuilding standard infrastructure.

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS · Prisma · PostgreSQL · shadcn/ui · Framer Motion · Recharts · Resend · Netlify

## Running locally

**Prerequisites:** Node.js 18+, PostgreSQL 14+

### 1. Clone and install

```bash
git clone https://github.com/ethan5432/careverse-partner-platform.git
cd careverse-partner-platform
npm install
```

### 2. Environment setup

Copy `.env.example` to `.env.local` and fill in your values. Required variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/refferq"
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
RESEND_FROM_EMAIL="Your Name <onboarding@resend.dev>"
ADMIN_EMAILS="admin@yourdomain.com"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Database setup

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Create admin account

Register at `/register`, then run:

```sql
UPDATE users SET role = 'ADMIN', status = 'ACTIVE' WHERE email = 'your-email@example.com';
```

## Credits and license

Based on [Refferq](https://github.com/Refferq/Refferq) by the Refferq contributors, licensed under the MIT License. The original license is kept in [LICENSE](LICENSE).
