# Quadra Audio Website

Next.js site for Quadra / Hydra.

## Visual Editor (self-hosted Puck)

Open-source canvas editor ([Puck](https://puckeditor.com)). **Sanity is not used.**

### Access control (Auth0 + Google only)

1. Auth0 Application (SPA) with **only** the `google-oauth2` connection enabled.
2. Allowed Callback URLs (trailing slash):
   - `https://quadraaudio.com/editor/callback/`
   - `https://edit.quadraaudio.com/editor/callback/`
   - `http://localhost:3000/editor/callback/`
3. Allowed Logout URLs / Web Origins: same origins.
4. Env vars:

```bash
NEXT_PUBLIC_AUTH0_DOMAIN=your-tenant.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=your_spa_client_id
NEXT_PUBLIC_EDITOR_PUBLISH_SECRET=your-long-secret
```

5. Allowlist in Supabase table `editor_allowlist` — only those emails can open the editor after Google login. Manage rows in the Supabase SQL editor:

```sql
INSERT INTO editor_allowlist (email, note) VALUES ('pessoa@empresa.com', 'Editor')
ON CONFLICT (email) DO UPDATE SET active = true;
```

### Use it

1. Open `/editor/` (or subdomain `edit.quadraaudio.com` pointing at the same static host).
2. **Continuar com Google** → Auth0 forces Google.
3. If the Google email is in `editor_allowlist`, the Puck canvas loads.
4. Edit inline → **Publish** (Supabase `site_pages`).

### Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
