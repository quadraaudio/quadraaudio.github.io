<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:quadra-auth-rules -->
# Authentication — Google only (never Supabase Auth)

Quadra ID sign-in is **Google Identity Services (GIS) OAuth** in the browser (`src/lib/googleToken.ts`, `AuthProvider`, `/login`). Access tokens are verified against Google’s userinfo API; sessions live in localStorage / optional `AUTH_SECRET` cookie helpers.

**Hard rules for agents:**
- **Never** suggest, design, migrate to, or implement **Supabase Auth** (no `signInWithOAuth`, no `auth.users` signup, no Supabase session cookies, no Google provider via Supabase).
- **Never** suggest Auth0, NextAuth, Clerk, or other identity products as a replacement unless the user explicitly asks.
- Supabase remains **database + Edge Functions + storage only**. Edge functions authenticate callers with a **Google access token**, not a Supabase JWT.
- Legacy RPC names like `*_auth0` are historical naming only; they accept a Google subject id, not Auth0.
<!-- END:quadra-auth-rules -->
