# Quadra Platform Rebuild Plan

**Status:** Implementation in progress (Puck editor loop + Quadra blocks rebuilt)  
**Language of implementation:** English codebase / English docs  
**Brand outcome:** 100% Quadra Audio — Apple-aligned **structure**, not Apple assets or Apple code

> **Runtime note (Cloudflare static export):** Page publish does **not** use Next.js `/api` routes. The browser talks to **Supabase** directly (`src/lib/pages.ts`) so the free Cloudflare Pages static host stays compatible. `/edit` requires **Supabase Auth**; public pages read `status = 'published'`.

This document records the product and technical decisions for rebuilding the Quadra website from a clean slate, with a Wix-like visual editor, zero paid tooling, and hosting limited to the free resources already available.

---

## 1. Goals

| Goal | Definition of done |
|------|--------------------|
| **Non-developer editing** | The site owner edits pages on a visual canvas (drag blocks, click text, swap media, reorder sections) without opening source files or asking an AI for every copy change. |
| **Apple-aligned UX/UI** | Public pages follow Apple product-page **patterns** (hierarchy, rhythm, full-bleed media, one job per viewport, global + local nav). The result must still pass the brand test: remove the nav and it is clearly Quadra, not a generic template or an Apple clone. |
| **100% Quadra skin** | All copy, media, logos, tokens, and components are Quadra-owned. No Apple HTML/CSS/JS, no Apple CDN hotlinks, no mirrored `www.apple.com` tree in the repo or on the CDN. |
| **Own the stack** | Code lives on GitHub; site runs on Cloudflare; data on Supabase; editor is open source inside the app. |
| **Zero spend to build** | No paid SaaS editors, no paid themes, no paid fonts required to ship v1. (Payment processor fees apply only when selling, later.) |

---

## 2. Hard constraints (infrastructure)

Only these resources are in scope for building and hosting:

| Resource | Role |
|----------|------|
| **GitHub** | Source of truth, CI, deploy pipeline (free tier) |
| **Cloudflare (free)** | DNS / domain (`quadraaudio.com`) + site hosting (Pages / Workers via OpenNext or equivalent) |
| **Supabase (free)** | Postgres, Auth (lock down `/edit`), business tables (products, licenses, coupons, etc.) |
| **Open-source libraries** | Next.js, Puck (visual editor), GSAP, etc. — no paid editor license |

**Out of scope / rejected for this rebuild:**

- Paid visual builders (Builder.io, Plasmic commercial, Framer, Wix, Webflow) as the system of record  
- Form-only CMS as the primary editing UX (Payload-style field forms are not the “pen”)  
- Webiny / AWS-centric platforms (too heavy and not on the free Cloudflare path)  
- Vercel (or any host) as a required paid dependency — deploy target is Cloudflare free  
- Using a scraped `www.apple.com` folder or Apple CDN assets as the production baseline  

---

## 3. Core product decision: structure vs. copy

### What we take from Apple (structure only)

Treat public Apple product pages as a **private pattern notebook**, not as a codebase:

- Section types (hero, scroll chapters, feature bands, specs, final CTA)
- Narrative order (promise → proof → detail → purchase)
- Chrome patterns (global nav + product local nav)
- Typography *scale logic* and spacing rhythm (reimplemented with Quadra tokens)
- Full-bleed media as the default hero plane
- One primary job per viewport; restrained, intentional motion

### What must be Quadra (always)

- Brand name, product name (Hydra), voice, and legal copy  
- All images, video, icons, and the Hydra logo  
- React/SCSS components and design tokens  
- Page compositions saved as Quadra data in Supabase  

**Method:** inventory Apple structural patterns → map each pattern to a named **Quadra block** → register those blocks in Puck → compose pages only from that Lego set. After the inventory, Apple reference material stays off GitHub and off Cloudflare.

---

## 4. Target architecture

```text
┌─────────────────────────────────────────────────────────┐
│  Public site (Next.js on Cloudflare)                    │
│  Apple-aligned layout · Quadra components · GSAP motion │
└───────────────────────────┬─────────────────────────────┘
                            │ reads page JSON
                            ▼
┌─────────────────────────────────────────────────────────┐
│  Supabase (free)                                        │
│  pages · products · licenses · coupons · auth           │
└───────────────────────────┬─────────────────────────────┘
                            │ writes on publish
                            ▲
┌─────────────────────────────────────────────────────────┐
│  /edit (Puck visual editor, OSS)                        │
│  Drag Quadra blocks · inline text/media · publish       │
│  Auth-gated (Supabase) — owner only                     │
└─────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────┐
│  GitHub → CI → Cloudflare Pages/Workers                 │
└─────────────────────────────────────────────────────────┘
```

### Stack (greenfield)

| Layer | Choice | Notes |
|-------|--------|--------|
| App framework | **Next.js** (App Router) | Edge-friendly for Cloudflare |
| Visual editor | **Puck** (MIT) | Wix-like canvas; custom blocks only |
| Database / Auth | **Supabase** | Free tier; extend existing schema ideas |
| Hosting / DNS | **Cloudflare free** | Domain already on Cloudflare |
| Motion | **GSAP + ScrollTrigger** | Inside Quadra components, not a free-form builder |
| Design | **Quadra tokens + blocks** | No third-party theme |
| Commerce (phase later) | Stripe + preserved license/API logic | Fees only on successful sales |

### Why Puck (not forms, not Webiny)

- **Forms-only CMS:** not acceptable — owner wants canvas editing like Wix.  
- **Webiny:** full AWS digital-experience platform; wrong host, heavy ops for day one.  
- **Puck:** open source, embeds in Next, registers **our** React blocks, persists JSON — matches free stack and editing requirement.

### Editor rule (keeps UI “Apple-grade”)

The canvas must **not** expose raw “box + free text + arbitrary columns” like an open Wix theme.

Allowed pieces are **only** registered Quadra blocks, for example:

| Block ID | Structural role (Apple-aligned) | Owner can edit |
|----------|----------------------------------|----------------|
| `QuadraHero` | Full-bleed first viewport | Brand line, headline, subcopy, CTAs, media |
| `QuadraLocalNav` | Product sticky bar | Product name, anchors, Buy link |
| `QuadraScrollChapter` | Pinned / scrubbed chapter | Title, body, media |
| `QuadraFeatureBand` | One feature, one idea | Title, body, media, layout variant |
| `QuadraHighlightGrid` | Highlight tiles | Tile titles, images, links |
| `QuadraSpecs` | Technical / compatibility | Spec rows |
| `QuadraFinalCTA` | Closing purchase band | Copy, CTA, media |
| `QuadraProductShelf` | Store entry points | Product refs from Supabase |

Layout and motion stay in code; content stays in the canvas.

---

## 5. How editing works (day-to-day)

1. Owner signs in (Supabase Auth) and opens `/edit` (or `/edit/[slug]`).  
2. Puck canvas shows the page as visitors will see it, composed of Quadra blocks.  
3. Owner drags blocks, reorders them, clicks to change text, replaces images/video, sets CTA URLs.  
4. **Publish** writes the page document (Puck JSON + metadata) to Supabase (`pages` or equivalent).  
5. Public routes load that document and render the same React blocks (no Apple runtime).  
6. Deploying **code** (new block types, token changes, API routes) remains a GitHub → Cloudflare pipeline; deploying **content** does not require a code deploy.

---

## 6. Clean-slate rebuild policy

### 6.1 Default: delete current site UI and structure

The rebuild assumes **wiping the current frontend and marketing/store UI**, including (non-exhaustive):

- Existing App Router pages and layouts built for the old design  
- Current marketing components, SCSS modules, and ad-hoc “Apple CDN” media references  
- Context providers and UI tied only to the old presentation layer  
- Content hardcoded in TypeScript as the owner’s editing surface  
- Any dependency on mirrored Apple site files  

A new Next.js app shell is created for Cloudflare + Puck + Quadra blocks.

### 6.2 Preserve: external integrations and Hydra logo

**Keep** code and config that encode **external systems, APIs, crypto, and database contracts** — re-home them into the new tree rather than rewriting business logic from memory.

#### A. Supabase & data contracts

| Keep | Purpose |
|------|---------|
| `src/lib/supabase.ts` | Client, coupons, licenses, products helpers |
| `supabase_schema.sql` | Products, licenses, coupons, related SQL |
| Env var names / wiring for `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (prefer env-only; avoid hardcoding secrets in source going forward) |

#### B. License crypto & app auth tokens

| Keep | Purpose |
|------|---------|
| `src/lib/licenseCrypto.ts` | Offline license key generation/validation, app auth token helpers |

#### C. HTTP API routes (external / client-facing contracts)

| Keep | Purpose |
|------|---------|
| `src/app/api/activate/route.ts` | Activation API |
| `src/app/api/license/route.ts` | License API |
| `src/app/api/sync-license/route.ts` | License sync |
| `src/app/api/coupons/validate/route.ts` | Coupon validation API |
| `src/app/api/updates/latest/route.ts` | Update feed / latest version |
| `src/app/download/latest/route.ts` | Latest download redirect/stream contract |

These routes (and their request/response shapes) are treated as **integration surface area** for Hydra / store / account flows. They may be lightly adapted to the new app layout, but must not be discarded casually.

#### D. Hydra logo (brand asset)

| Keep | Purpose |
|------|---------|
| `public/images/hydra_app_icon.jpg` | Hydra logo / app icon for nav, product, store, OS-facing identity |

If additional official Hydra logo masters exist outside the repo (SVG/PDF), they should be added under `public/brand/` during the rebuild and used instead of any Apple or placeholder art.

#### E. Optional keep (ops / DNS notes)

| Keep if still useful | Purpose |
|----------------------|---------|
| `quadraaudio.com.zone` | DNS history — **update** records from legacy Vercel targets to Cloudflare Pages/Workers as part of cutover |
| Documented env keys in `.env.example` (create if missing) | Onboarding without committing secrets |

### 6.3 Explicitly do **not** preserve as foundation

- Scraped or local `www.apple.com` trees  
- Hotlinked `https://www.apple.com/...` media in production components  
- Old page modules whose only value is visual imitation without Quadra ownership  
- Dead CMS experiments and unused clients  

---

## 7. Suggested repository shape (after wipe)

```text
quadraaudio.github.io/
├── docs/
│   └── QUADRA_PLATFORM_PLAN.md          # this file
├── public/
│   └── brand/
│       └── hydra-logo…                  # preserved Hydra logo
├── src/
│   ├── app/
│   │   ├── (public)/                    # marketing, product, store shells
│   │   ├── edit/                        # Puck canvas (auth-gated)
│   │   ├── api/                         # PRESERVED external API routes
│   │   └── download/                    # PRESERVED download contract
│   ├── components/
│   │   ├── chrome/                      # global nav, footer (Quadra)
│   │   └── blocks/                      # Puck-registered Quadra blocks
│   ├── design/                          # tokens (type, color, space, motion)
│   ├── puck/                            # editor config + block registry
│   └── lib/
│       ├── supabase.ts                  # PRESERVED / re-homed
│       └── licenseCrypto.ts             # PRESERVED / re-homed
├── supabase_schema.sql                  # PRESERVED (+ pages table migration)
├── package.json
└── … Cloudflare / OpenNext config
```

---

## 8. Supabase additions for the editor

On top of existing product/license/coupon ideas, v1 needs at least:

```text
pages
  id, slug, title, data (jsonb — Puck document),
  status (draft|published), updated_at, updated_by
```

- Public site reads `status = published` by `slug`.  
- `/edit` reads/writes drafts and publish.  
- RLS: only authenticated owner (or allowlisted emails) can mutate; public read for published rows as needed.

Exact SQL to be added in a follow-up migration when implementation starts.

---

## 9. Build phases

### Phase 0 — Preserve & wipe prep

1. Copy preserved API/lib/SQL/logo into a safe branch or `preserve/` snapshot.  
2. Remove Apple CDN usage and any mirrored Apple assets from what will be redeployed.  
3. Reset app UI to a minimal Next shell targeting Cloudflare.

### Phase 1 — Design system + first blocks

1. Quadra tokens (no paid fonts; system / open fonts).  
2. Implement 3–4 blocks: Hero, LocalNav, ScrollChapter, FinalCTA.  
3. Motion (GSAP) inside those components only.

### Phase 2 — Puck + Supabase pages

1. Register blocks in Puck.  
2. Auth-gate `/edit`.  
3. Persist/publish page JSON.  
4. Home (and then Hydra product page) composed **only** in the canvas.

### Phase 3 — Store & account (reuse preserved APIs)

1. Restyle store/account/checkout shells to Quadra chrome.  
2. Reconnect preserved Supabase helpers + API routes.  
3. Stripe (or existing payment path) when ready — cost only on transactions.

### Phase 4 — Cutover

1. Point Cloudflare DNS at the new Pages/Workers deployment.  
2. Verify activate / license / download / updates contracts still work for Hydra clients.  
3. Owner operates content exclusively via `/edit`.

---

## 10. Success criteria

- Owner can change homepage headline, media, and section order **without code**.  
- Public UX feels like a high-end product site (Apple **structure**), branded **Quadra/Hydra**.  
- No Apple copyrighted assets or code in GitHub or production.  
- Site runs on **GitHub + Cloudflare free + Supabase free + Puck OSS**.  
- External Hydra-related APIs and license crypto behavior remain intact after the wipe.  
- Hydra logo ships from Quadra-owned brand files only.

---

## 11. Decision log (summary)

| Topic | Decision |
|-------|----------|
| Edit like Wix? | Yes — visual canvas |
| Pay for editor SaaS? | No — **Puck** OSS |
| Form-based CMS as primary UX? | No |
| Host / DNS | Cloudflare free |
| Database / auth | Supabase free |
| Repo | GitHub |
| Apple.com folder / CDN as base? | No — pattern reference only |
| Brand output | 100% Quadra, Apple-aligned structure |
| Current UI | Wipe |
| Keep | External API/integration code + Hydra logo (+ schema/crypto as listed) |

---

## 12. Next step when implementation starts

1. Snapshot preserved paths listed in §6.2.  
2. Scaffold Cloudflare-ready Next app + Puck.  
3. Add `pages` table migration.  
4. Ship Home with the minimal Quadra block set editable at `/edit`.

Until then, this document is the source of truth for architecture and rebuild policy.
